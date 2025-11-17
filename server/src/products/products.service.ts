import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { productDto } from './dto/prodDto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products) private prodRepo: Repository<Products>,
  ) {}

  async createProducr(dto: productDto) {
    try {
      const product = this.prodRepo.create(dto);
      return await this.prodRepo.save(product);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getProducts(minPrice?: number, maxPrice?: number, word?: string) {
    let where: any = {};

    if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);
    else if (minPrice) where.price = MoreThanOrEqual(minPrice);
    else if (maxPrice) where.price = LessThanOrEqual(maxPrice);

    if (word) {
      where.name = ILike(`%${word}%`);
    }

    return await this.prodRepo.find({ where, order: { price: 'DESC' } });
  }

  async pagination(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prodRepo.findAndCount({
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async delete(id: number) {
    const product = await this.prodRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Not found');

    await this.prodRepo.remove(product);
    return { message: `${product.name} deleted successfully` };
  }
}
