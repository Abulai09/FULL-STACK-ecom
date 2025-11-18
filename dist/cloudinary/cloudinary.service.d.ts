export declare class CloudinaryService {
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<unknown>;
    deleteFile(publicId: string): Promise<any>;
}
