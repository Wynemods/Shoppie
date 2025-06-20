/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  stock: number;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private idCounter = 1;

  create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct: Product = {
      id: this.idCounter++,
      stock: createProductDto.stock ?? 0,
      ...createProductDto,
    };
    this.products.push(newProduct);
    return  Promise.resolve(newProduct);
  }


findAll(): Promise<Product[]> {
  return Promise.resolve(this.products);
}


findOne(id: number): Promise<Product> {
  const product = this.products.find((p) => p.id === id);
  if (!product) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }
  return Promise.resolve(product);
}


  async update(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return product;
  }

 
remove(id: number): Promise<void> {
  const index = this.products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }
  this.products.splice(index, 1);
  return Promise.resolve();
}


  async reduceStock(id: number, quantity: number): Promise<void> {
    const product = await this.findOne(id);
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    product.stock -= quantity;
  }
}
