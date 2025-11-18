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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const JwtAuthGuard_1 = require("../guards/JwtAuthGuard");
let OrderController = class OrderController {
    orderServ;
    constructor(orderServ) {
        this.orderServ = orderServ;
    }
    async addOrder(req) {
        const userId = req.user.id;
        return await this.orderServ.addOrder(userId);
    }
    async myOrders(req) {
        const userId = req.user.id;
        return await this.orderServ.getMyOrders(userId);
    }
    async cancellOrder(req, id) {
        const userId = req.user.id;
        return await this.orderServ.cancellOrder(Number(id), userId);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('addOrder'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addOrder", null);
__decorate([
    (0, common_1.Get)('myOrders'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "myOrders", null);
__decorate([
    (0, common_1.Post)('cancellOrder/:id'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "cancellOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map