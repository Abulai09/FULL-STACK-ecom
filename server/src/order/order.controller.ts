import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderServ: OrderService) {}

  @Post('addOrder')
  @UseGuards(JwtAuthGuard)
  async addOrder(@Req() req) {
    const userId = req.user.id;
    return await this.orderServ.addOrder(userId);
  }

  @Get('myOrders')
  @UseGuards(JwtAuthGuard)
  async myOrders(@Req() req) {
    const userId = req.user.id;
    return await this.orderServ.getMyOrders(userId);
  }

  @Post('cancellOrder/:id')
  @UseGuards(JwtAuthGuard)
  async cancellOrder(@Req() req, @Param('id') id: number) {
    const userId = req.user.id;
    return await this.orderServ.cancellOrder(Number(id), userId);
  }
}
