export interface IImageService {
  uploadImage(file: Express.Multer.File): Promise<string>;
  deleteImage(imageUrl: string): Promise<void>;
}