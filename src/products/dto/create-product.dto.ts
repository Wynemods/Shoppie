/* eslint-disable prettier/prettier */
export class CreateProductDto {
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  stock?: number;
}
