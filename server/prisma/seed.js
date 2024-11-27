import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pizzas = [
    {
      name: 'Margherita',
      description: 'Classic Neapolitan pizza with tomato, mozzarella, fresh basil, and a drizzle of olive oil.',
      cost: 12.99,
      image_filename: 'pizza1.jpg'
    },
    {
      name: 'Marinara',
      description: 'Simple and tasty pizza with tomato, garlic, oregano, and extra virgin olive oil.',
      cost: 10.99,
      image_filename: 'pizza2.jpg'
    },
    {
      name: 'Quattro Stagioni',
      description: 'A pizza divided into four sections with artichokes, olives, ham, and mushrooms.',
      cost: 14.99,
      image_filename: 'pizza3.jpg'
    },
    {
      name: 'Capricciosa',
      description: 'Tomato, mozzarella, ham, mushrooms, artichokes, and olives.',
      cost: 15.49,
      image_filename: 'pizza4.jpg'
    },
    {
      name: 'Diavola',
      description: 'Spicy pizza with tomato, mozzarella, salami, and chili peppers.',
      cost: 13.99,
      image_filename: 'pizza5.jpg'
    },
    {
      name: 'Napoli',
      description: 'Tomato, mozzarella, anchovies, olives, and capers.',
      cost: 13.49,
      image_filename: 'pizza6.jpg'
    },
    {
      name: 'Salsiccia e Friarielli',
      description: 'Italian sausage with friarielli (rapini), mozzarella, and tomato sauce.',
      cost: 16.49,
      image_filename: 'pizza7.jpg'
    },
    {
      name: 'Funghi',
      description: 'Tomato, mozzarella, and mushrooms, a simple, earthy pizza.',
      cost: 12.49,
      image_filename: 'pizza8.jpg'
    },
    {
      name: 'Bufalina',
      description: 'Mozzarella di bufala, cherry tomatoes, and fresh basil.',
      cost: 17.99,
      image_filename: 'pizza9.jpg'
    },
    {
      name: 'Prosciutto e Rucola',
      description: 'Mozzarella, prosciutto crudo, and arugula, finished with a drizzle of olive oil.',
      cost: 16.99,
      image_filename: 'pizza10.jpg'
    }
  ];

  for (const pizza of pizzas) {
    await prisma.product.create({
      data: pizza
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
