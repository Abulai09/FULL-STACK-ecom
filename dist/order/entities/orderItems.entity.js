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
exports.OrderItems = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
const products_entity_1 = require("../../products/products.entity");
let OrderItems = class OrderItems {
    id;
    name;
    quantity;
    priceAtPurchase;
    order;
    products;
};
exports.OrderItems = OrderItems;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderItems.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderItems.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderItems.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderItems.prototype, "priceAtPurchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.items),
    __metadata("design:type", order_entity_1.Order)
], OrderItems.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => products_entity_1.Products, (products) => products.orderItems),
    __metadata("design:type", products_entity_1.Products)
], OrderItems.prototype, "products", void 0);
exports.OrderItems = OrderItems = __decorate([
    (0, typeorm_1.Entity)('orderItems')
], OrderItems);
//# sourceMappingURL=orderItems.entity.js.map