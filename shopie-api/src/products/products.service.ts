/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaClient, Product as PrismaProduct } from '@prisma/client';

@Injectable()
export class ProductsService {
  private prisma = new PrismaClient();

  async create(createProductDto: CreateProductDto): Promise<PrismaProduct> {
    if (!createProductDto.name || !createProductDto.shortDescription || createProductDto.price == null || !createProductDto.image) {
      throw new Error('Missing required product fields');
    }
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        stock: createProductDto.stock ?? 0,
        image: createProductDto.image,
      },
    });
  }

  async findAll(): Promise<PrismaProduct[]> {
    return this.prisma.product.findMany();
  }

  async findOne(id: number): Promise<PrismaProduct> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<PrismaProduct> {
    await this.findOne(id); // ensure product exists
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // ensure product exists
    // Delete related cart items first to avoid foreign key constraint error
    await this.prisma.cartItem.deleteMany({ where: { productId: id } });
    await this.prisma.product.delete({ where: { id } });
  }

  async reduceStock(id: number, quantity: number): Promise<void> {
    const product = await this.findOne(id);
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    await this.prisma.product.update({
      where: { id },
      data: { stock: product.stock - quantity },
    });
  }
}
