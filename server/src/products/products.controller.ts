import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';
import { Role } from 'src/guards/RolesDecorator';
import { productDto } from './dto/prodDto';
import { RolesGuard } from 'src/guards/RolesGuard';

@Controller('products')
export class ProductsController {
  constructor(private readonly prodServ: ProductsService) {}

  @Get('products')
  async getAllProducts(@Query('page') page = 1, @Query('limit') limit = 3) {
    return await this.prodServ.pagination(page, limit);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async create(@Body() dto: productDto) {
    await this.prodServ.createProducr(dto);
  }

  @Get('getAll')
  async getAll(
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('word') word?: string,
  ) {
    return await this.prodServ.getProducts(minPrice, maxPrice, word);
  }

  @Delete('delProd/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  async del(@Param('id') id: number) {
    return await this.prodServ.delete(Number(id));
  }
}
