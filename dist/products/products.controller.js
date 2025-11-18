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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const JwtAuthGuard_1 = require("../guards/JwtAuthGuard");
const RolesDecorator_1 = require("../guards/RolesDecorator");
const prodDto_1 = require("./dto/prodDto");
const RolesGuard_1 = require("../guards/RolesGuard");
const platform_express_1 = require("@nestjs/platform-express");
let ProductsController = class ProductsController {
    prodServ;
    constructor(prodServ) {
        this.prodServ = prodServ;
    }
    async getAllProducts(page = 1, limit = 3) {
        return await this.prodServ.pagination(page, limit);
    }
    async create(dto, file) {
        return await this.prodServ.createProducr(dto, file);
    }
    async getAll(minPrice, maxPrice, word, category) {
        return await this.prodServ.getProducts(minPrice, maxPrice, word, category);
    }
    async del(id) {
        return await this.prodServ.delete(Number(id));
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('get'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard, RolesGuard_1.RolesGuard),
    (0, RolesDecorator_1.Role)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prodDto_1.productDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('getAll'),
    __param(0, (0, common_1.Query)('minPrice')),
    __param(1, (0, common_1.Query)('maxPrice')),
    __param(2, (0, common_1.Query)('word')),
    __param(3, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Delete)('delProd/:id'),
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard, RolesGuard_1.RolesGuard),
    (0, RolesDecorator_1.Role)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "del", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map