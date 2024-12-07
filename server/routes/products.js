import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

router.get('/all', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    res.status(400).send('Please provide a valid id number');
    return;
  }

  const product = await prisma.product.findUnique({
    where: {
      product_id: parseInt(id)
    }
  });

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

router.post('/purchase', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated');
  }

  const {
    street,
    city,
    province,
    country,
    postal_code,
    credit_card,
    credit_expire,
    credit_cvv,
    cart,
    phone_number,
    is_pickup
  } = req.body;

  if (!cart || !credit_card || !credit_expire || !credit_cvv) {
    return res.status(400).send('Missing required payment information');
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const purchase = await prisma.purchase.create({
        data: {
          customer_id: req.session.userId,
          phone_number,
          is_pickup: is_pickup === 'true',
          street,
          city,
          province,
          country,
          postal_code,
          credit_card,
          credit_expire,
          credit_cvv,
          order_date: new Date()
        }
      });

      const cartItems = cart.split(',').filter(Boolean).map(item => {
        const [product_id, quantity = 1] = item.split(':');
        return {
          purchase_id: purchase.purchase_id,
          product_id: parseInt(product_id),
          quantity: parseInt(quantity)
        };
      });

      if (cartItems.length === 0) {
        throw new Error('No items in cart');
      }

      await prisma.purchaseItem.createMany({
        data: cartItems
      });

      return purchase;
    });

    res.status(200).json({
      message: 'Purchase completed successfully',
      purchase_id: result.purchase_id
    });
  } catch (error) {
    console.error('Detailed purchase error:', error);
    res.status(500).send(error.message || 'Failed to complete purchase');
  }
});

export default router;
