/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Request } from 'express';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.productsService.findAll().then(products => {
      const protocol = req.protocol;
      const host = req.get('host');
      return products.map(product => {
        // If image is a filename without URL, prepend full URL
        let imageUrl = product.image;
        if (imageUrl) {
          // Remove any leading slashes from image filename to avoid double slashes in URL
          imageUrl = imageUrl.replace(/^\/+/, '');
          // Remove any duplicate /uploads/ in the path
          imageUrl = imageUrl.replace(/^(uploads\/)+/, '');
          imageUrl = `${protocol}://${host}/uploads/${imageUrl}`;
        }
        return { ...product, image: imageUrl };
      });
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request): { imageUrl: string; } {
    if (!file || typeof file.filename !== 'string') {
      throw new Error('File upload failed');
    }
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${file.filename}`;
    return { imageUrl };
  }
}
