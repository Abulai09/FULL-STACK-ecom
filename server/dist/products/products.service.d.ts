import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { productDto } from './dto/prodDto';
export declare class ProductsService {
    private prodRepo;
    constructor(prodRepo: Repository<Products>);
    createProducr(dto: productDto): Promise<Products>;
    getProducts(minPrice?: number, maxPrice?: number, word?: string): Promise<Products[]>;
    pagination(page: number, limit: number): Promise<{
        data: Products[];
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
