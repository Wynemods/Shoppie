/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId')
  addProductToCart(
    @Param('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<any> { 
    return this.cartService.addProductToCart(userId, addToCartDto);
  }

  @Get(':userId')
  getCartContents(@Param('userId') userId: string): Promise<any> {
    return Promise.resolve(this.cartService.getCartContents(userId));
  }
}
