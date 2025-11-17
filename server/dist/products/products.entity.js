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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const cartItems_entity_1 = require("../cart/entities/cartItems.entity");
const orderItems_entity_1 = require("../order/entities/orderItems.entity");
const typeorm_1 = require("typeorm");
let Products = class Products {
    id;
    name;
    price;
    category;
    cartItems;
    orderItems;
};
exports.Products = Products;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Products.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Products.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Products.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Products.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cartItems_entity_1.CartItems, (cartItems) => cartItems.products),
    __metadata("design:type", Array)
], Products.prototype, "cartItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderItems_entity_1.OrderItems, (orderItems) => orderItems.products),
    __metadata("design:type", Array)
], Products.prototype, "orderItems", void 0);
exports.Products = Products = __decorate([
    (0, typeorm_1.Entity)('products')
], Products);
//# sourceMappingURL=products.entity.js.map