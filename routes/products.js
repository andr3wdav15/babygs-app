import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext;
      cb(null, uniqueFilename);
    }
  });
  const upload = multer({ storage: storage });

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

// add a product to the database
router.post('/add', upload.single('image'), async (req, res) => {
    const { name, description, cost } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    
    if (!name || !description || !cost || !image_filename) {
        return res.status(400).send('Missing required fields');
    }
    const product = await prisma.product.create({
        data: {
            name: name,
            description: description,
            cost: parseFloat(cost),
            image_filename: image_filename
        }
    });
    res.json(product);
});

// purchase a product
router.post('/purchase', async (req, res) => {
    res.send('purchase');
});

export default router;