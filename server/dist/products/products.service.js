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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_entity_1 = require("./products.entity");
const typeorm_2 = require("typeorm");
let ProductsService = class ProductsService {
    prodRepo;
    constructor(prodRepo) {
        this.prodRepo = prodRepo;
    }
    async createProducr(dto) {
        try {
            const product = this.prodRepo.create(dto);
            return await this.prodRepo.save(product);
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getProducts(minPrice, maxPrice, word) {
        let where = {};
        if (minPrice && maxPrice)
            where.price = (0, typeorm_2.Between)(minPrice, maxPrice);
        else if (minPrice)
            where.price = (0, typeorm_2.MoreThanOrEqual)(minPrice);
        else if (maxPrice)
            where.price = (0, typeorm_2.LessThanOrEqual)(maxPrice);
        if (word) {
            where.name = (0, typeorm_2.ILike)(`%${word}%`);
        }
        return await this.prodRepo.find({ where, order: { price: 'DESC' } });
    }
    async pagination(page, limit) {
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
    async delete(id) {
        const product = await this.prodRepo.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Not found');
        await this.prodRepo.remove(product);
        return { message: `${product.name} deleted successfully` };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(products_entity_1.Products)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map