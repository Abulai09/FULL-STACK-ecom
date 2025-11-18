"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_entity_1 = require("../cart/entities/cart.entity");
const cartItems_entity_1 = require("../cart/entities/cartItems.entity");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const orderItems_entity_1 = require("./entities/orderItems.entity");
let OrderService = class OrderService {
    userRepo;
    cartRepo;
    cartItemsRepo;
    orderRepo;
    orderItemsRepo;
    constructor(userRepo, cartRepo, cartItemsRepo, orderRepo, orderItemsRepo) {
        this.userRepo = userRepo;
        this.cartRepo = cartRepo;
        this.cartItemsRepo = cartItemsRepo;
        this.orderRepo = orderRepo;
        this.orderItemsRepo = orderItemsRepo;
    }
    async addOrder(userId) {
        try {
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.UnauthorizedException('Unauthorized');
            const cart = await this.cartRepo.findOne({
                where: { userId },
                relations: ['items', 'items.products'],
            });
            if (!cart)
                throw new common_1.NotFoundException('Not found');
            const items = cart.items.map((c) => ({
                name: c.name,
                quantity: c.quantity,
                priceAtPurchase: c.priceAtPurchase,
                total: Number(c.quantity) * c.priceAtPurchase,
                products: c.products,
            }));
            const totalPrice = items.reduce((sum, i) => sum + i.total, 0);
            const order = this.orderRepo.create({
                totalPrice: totalPrice,
                status: 'pending',
                user,
                userId,
                items: [],
            });
            await this.orderRepo.save(order);
            const OrderItems = this.orderItemsRepo.create(items.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                priceAtPurchase: i.priceAtPurchase,
                order,
                products: i.products,
            })));
            await this.orderItemsRepo.save(OrderItems);
            await this.cartItemsRepo.delete({ cart: { id: cart.id } });
            return {
                message: 'Order created successfully',
                orderId: order.id,
                totalPrice: order.totalPrice,
                status: order.status,
                items: OrderItems.map((o) => ({
                    name: o.name,
                    quantity: o.quantity,
                    price: o.priceAtPurchase,
                })),
            };
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getMyOrders(userId) {
        const orders = await this.orderRepo.find({
            where: { userId },
            relations: ['items'],
            order: { id: 'DESC' },
        });
        if (!orders.length)
            throw new common_1.NotFoundException('not found:(');
        return orders.map((order) => ({
            id: order.id,
            totalPrice: order.totalPrice,
            status: order.status,
            items: order.items.map((o) => ({
                name: o.name,
                price: o.priceAtPurchase,
                quantity: o.quantity,
            })),
        }));
    }
    async cancellOrder(orderId, userId) {
        const order = await this.orderRepo.findOne({
            where: {
                id: orderId,
                user: { id: userId },
            },
        });
        if (!order)
            throw new common_1.NotFoundException('not found:(');
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException(`Order cannot be cancelled. Current status: ${order.status}`);
        }
        order.status = 'cancelled';
        await this.orderRepo.save(order);
        return { message: 'Your order was cancelled' };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(2, (0, typeorm_1.InjectRepository)(cartItems_entity_1.CartItems)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(orderItems_entity_1.OrderItems)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map