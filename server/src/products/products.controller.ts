import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';
import { Role } from 'src/guards/RolesDecorator';
import { productDto } from './dto/prodDto';
import { RolesGuard } from 'src/guards/RolesGuard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly prodServ: ProductsService) {}

  @Get('get')
  async getAllProducts(@Query('page') page = 1, @Query('limit') limit = 3) {
    return await this.prodServ.pagination(page, limit);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: productDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.prodServ.createProducr(dto, file);
  }

  @Get('getAll')
  async getAll(
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('word') word?: string,
    @Query('category') category?: string,
  ) {
    return await this.prodServ.getProducts(minPrice, maxPrice, word, category);
  }

  @Delete('delProd/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async del(@Param('id') id: number) {
    return await this.prodServ.delete(Number(id));
  }

  @Post('delImg/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async delImg(@Param('id') id: string) {
    return await this.prodServ.delImg(id);
  }
}
