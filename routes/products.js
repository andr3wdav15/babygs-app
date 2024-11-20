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
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
});

// purchase a product
router.post('/purchase', async (req, res) => {
    res.send('purchase');
});

export default router;