/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany();
  console.log('Products in DB:', products);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
