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
    res.send('purchase');
});

export default router;