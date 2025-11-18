import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartServ: CartService) {}

  @Post('addCart/:id')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    return await this.cartServ.addToCart(userId, Number(id));
  }

  @Get('myCart')
  @UseGuards(JwtAuthGuard)
  async getMy(@Req() req) {
    const userId = req.user.id;
    return await this.cartServ.getMyCart(userId);
  }

  @Delete('del/:id')
  @UseGuards(JwtAuthGuard)
  async del(@Req() req, @Param('id') id: number, @Body('q') q: number) {
    const userId = req.user.id;
    return await this.cartServ.removeFromMyCart(userId, Number(id), Number(q));
  }
}
