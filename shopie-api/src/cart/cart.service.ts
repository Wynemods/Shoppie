/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { PrismaClient, CartItem as PrismaCartItem } from '@prisma/client';

@Injectable()
export class CartService {
  private prisma = new PrismaClient();

  async addProductToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<(PrismaCartItem & { product: any })[]> {
    const { productId, quantity } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Reduce stock
    await this.prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock - quantity },
    });

    // Check if cart item exists
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }

    // Return updated cart items with product details
    return this.getCartContents(userId);
  }

  async getCartContents(
    userId: string,
  ): Promise<(PrismaCartItem & { product: any })[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    return cartItems;
  }
}
