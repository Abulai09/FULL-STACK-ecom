import { ProductsService } from './products.service';
import { productDto } from './dto/prodDto';
export declare class ProductsController {
    private readonly prodServ;
    constructor(prodServ: ProductsService);
    getAllProducts(page?: number, limit?: number): Promise<{
        data: import("./products.entity").Products[];
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    }>;
    create(dto: productDto): Promise<void>;
    getAll(minPrice?: number, maxPrice?: number, word?: string): Promise<import("./products.entity").Products[]>;
    del(id: number): Promise<{
        message: string;
    }>;
}
