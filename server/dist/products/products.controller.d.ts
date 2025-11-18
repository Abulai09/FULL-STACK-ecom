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
    create(dto: productDto, file: Express.Multer.File): Promise<import("./products.entity").Products>;
    getAll(minPrice?: number, maxPrice?: number, word?: string, category?: string): Promise<import("./products.entity").Products[]>;
    del(id: number): Promise<{
        message: string;
    }>;
}
