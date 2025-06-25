/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'].includes(ext)) {
      continue; // skip non-image files
    }

    const imageUrl = `/uploads/${file}`;

    // Check if product with this image already exists
    const existing = await prisma.product.findFirst({
      where: { image: imageUrl as any },
    });
    if (existing) {
      console.log(`Product with image ${imageUrl} already exists, skipping.`);
      continue;
    }

    // Create product with default values and image URL
    await prisma.product.create({
      data: {
        name: `Imported Product ${file}`,
        price: 0,
        stock: 0,
        image: imageUrl,
      },
    });
    console.log(`Created product for image ${imageUrl}`);
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
