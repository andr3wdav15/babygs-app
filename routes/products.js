import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });

// get all products
router.get('/all', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
});

// get a single product
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) { // if invalid id, send 400
    res.status(400).send('Please provide a valid id number');
    return;
  }

  const product = await prisma.product.findUnique({ // find the product by id
    where: {
      id: parseInt(id)
    }
  });

  if (product) { // if product is found send json
    res.status(200).json(product);
  } else { // else 404
    res.status(404).send('Product not found');
  }
});

// purchase a product
router.post('/purchase', async (req, res) => {
  if (!req.session.customer_id) {
    return res.status(401).send('Unauthorized: Please log in to complete your purchase');
  }

  const { street, city, province, country, postal_code, credit_card, credit_expire, credit_cvv, cart, invoice_amt, invoice_tax, invoice_total } = req.body;

  // validate inputs
  if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total) {
    return res.status(400).send('Missing required fields');
  }

  // parse string from cart into array
  const cartItems = cart.split(',').map(id => parseInt(id));

  const purchase = await prisma.purchase.create({
    data: { // create purchase
      customer_id: req.session.customer_id,
      street,
      city,
      province,
      country,
      postal_code,
      credit_card,
      credit_expire,
      credit_cvv,
      invoice_amt,
      invoice_tax,
      invoice_total,
      order_date: new Date()
    }
  });

  const purchaseItems = cartItems.map(product_id => ({
    purchase_id: purchase.purchase_id, // create purchase items
    product_id,
    quantity: 1
  }));

  await prisma.purchaseItem.createMany({
    data: purchaseItems
  });

  res.status(200).send('Purchase completed successfully');
});

export default router;