/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sampleProducts = [
    {
      name: 'Wireless Mouse',
      price: 25.99,
      stock: 100,
      image: 'https://example.com/images/wireless-mouse.jpg',
    },
    {
      name: 'Mechanical Keyboard',
      price: 79.99,
      stock: 50,
      image: 'https://example.com/images/mechanical-keyboard.jpg',
    },
    {
      name: 'USB-C Hub',
      price: 45.0,
      stock: 75,
      image: 'https://example.com/images/usb-c-hub.jpg',
    },
    {
      name: 'Noise Cancelling Headphones',
      price: 129.99,
      stock: 40,
      image: 'https://example.com/images/noise-cancelling-headphones.jpg',
    },
    {
      name: 'Portable SSD 1TB',
      price: 149.99,
      stock: 60,
      image: 'https://example.com/images/portable-ssd.jpg',
    },
    {
      name: 'Smartwatch',
      price: 199.99,
      stock: 30,
      image: 'https://example.com/images/smartwatch.jpg',
    },
    {
      name: 'Bluetooth Speaker',
      price: 59.99,
      stock: 80,
      image: 'https://example.com/images/bluetooth-speaker.jpg',
    },
    {
      name: 'Webcam 1080p',
      price: 39.99,
      stock: 90,
      image: 'https://example.com/images/webcam.jpg',
    },
    {
      name: 'Gaming Chair',
      price: 249.99,
      stock: 20,
      image: 'https://example.com/images/gaming-chair.jpg',
    },
    {
      name: 'Laptop Stand',
      price: 29.99,
      stock: 100,
      image: 'https://example.com/images/laptop-stand.jpg',
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Sample products added successfully.');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
