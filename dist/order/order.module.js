"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const orderItems_entity_1 = require("./entities/orderItems.entity");
const user_entity_1 = require("../user/user.entity");
const products_entity_1 = require("../products/products.entity");
const cart_entity_1 = require("../cart/entities/cart.entity");
const cartItems_entity_1 = require("../cart/entities/cartItems.entity");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.Order,
                orderItems_entity_1.OrderItems,
                user_entity_1.User,
                products_entity_1.Products,
                cart_entity_1.Cart,
                cartItems_entity_1.CartItems,
            ]),
        ],
        providers: [order_service_1.OrderService],
        controllers: [order_controller_1.OrderController],
    })
], OrderModule);
//# sourceMappingURL=order.module.js.map