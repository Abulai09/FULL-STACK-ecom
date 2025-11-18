import { Products } from './products.entity';
import { Repository } from 'typeorm';
import { productDto } from './dto/prodDto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
export declare class ProductsService {
    private prodRepo;
    private readonly cloudServ;
    constructor(prodRepo: Repository<Products>, cloudServ: CloudinaryService);
    createProducr(dto: productDto, file: Express.Multer.File): Promise<Products>;
    getProducts(minPrice?: number, maxPrice?: number, word?: string, category?: string): Promise<Products[]>;
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
