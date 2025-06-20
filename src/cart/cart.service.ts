/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';

export interface CartItem {
  productId: number;
  quantity: number;
}

@Injectable()
export class CartService {
  private carts: Map<string, CartItem[]> = new Map();

  constructor(private readonly productsService: ProductsService) {}

  async addProductToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartItem[]> {
    const { productId, quantity } = addToCartDto;
    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    await this.productsService.reduceStock(productId, quantity);

    let userCart = this.carts.get(userId);
    if (!userCart) {
      userCart = [];
      this.carts.set(userId, userCart);
    }

    const cartItem = userCart.find((item) => item.productId === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      userCart.push({ productId, quantity });
    }

    return userCart;
  }

  getCartContents(userId: string): CartItem[] {
    return this.carts.get(userId) || [];
  }
}
