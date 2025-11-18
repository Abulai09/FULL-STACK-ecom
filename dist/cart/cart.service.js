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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cartItems_entity_1 = require("./entities/cartItems.entity");
const products_entity_1 = require("../products/products.entity");
let CartService = class CartService {
    userRepo;
    cartRepo;
    cartItemsRepo;
    productRepo;
    constructor(userRepo, cartRepo, cartItemsRepo, productRepo) {
        this.userRepo = userRepo;
        this.cartRepo = cartRepo;
        this.cartItemsRepo = cartItemsRepo;
        this.productRepo = productRepo;
    }
    async addToCart(userId, productId) {
        try {
            const user = await this.userRepo.findOne({
                where: { id: userId },
                relations: ['cart'],
            });
            if (!user)
                throw new common_1.UnauthorizedException('Unauthorized');
            const product = await this.productRepo.findOne({
                where: { id: productId },
            });
            if (!product)
                throw new common_1.NotFoundException('Not found:<');
            let cart = user.cart;
            if (!cart) {
                cart = this.cartRepo.create({ items: [], user, userId });
                await this.cartRepo.save(cart);
            }
            let cartItems = await this.cartItemsRepo.findOne({
                where: {
                    cart: { id: cart.id },
                    products: { id: product.id },
                },
            });
            if (cartItems) {
                cartItems.quantity += 1;
            }
            else {
                cartItems = this.cartItemsRepo.create({
                    name: product.name,
                    priceAtPurchase: product.price,
                    quantity: 1,
                    cart,
                    products: product,
                });
            }
            await this.cartItemsRepo.save(cartItems);
            return cartItems;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getMyCart(userId) {
        const cart = await this.cartRepo.findOne({
            where: { userId },
            relations: ['items', 'items.products'],
        });
        if (!cart)
            throw new common_1.NotFoundException('cart is empty');
        const items = cart.items.map((c) => ({
            name: c.products.name,
            priceAtPurchase: Number(c.products.price),
            quantity: c.quantity,
            total: Number(c.quantity * c.products.price),
        }));
        const totalPrice = items.reduce((sum, i) => sum + i.total, 0);
        return {
            id: cart.id,
            totalPrice: totalPrice,
            items,
        };
    }
    async removeFromMyCart(userId, productId, quantity) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        const cart = await this.cartRepo.findOne({
            where: { userId },
            relations: ['items', 'items.products'],
        });
        if (!cart)
            throw new common_1.NotFoundException('cart is empty');
        const product = await this.cartItemsRepo.findOne({
            where: {
                cart: { id: cart.id },
                products: { id: productId },
            },
            relations: ['products'],
        });
        if (!product)
            throw new common_1.NotFoundException('Not found:<');
        if (quantity >= product.quantity) {
            await this.cartItemsRepo.remove(product);
            return { message: ` product deleted successfully ` };
        }
        product.quantity -= quantity;
        await this.cartItemsRepo.save(product);
        return { message: ` product reduced by ${quantity} ` };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(2, (0, typeorm_1.InjectRepository)(cartItems_entity_1.CartItems)),
    __param(3, (0, typeorm_1.InjectRepository)(products_entity_1.Products)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart.service.js.map