import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { QueryFailedError, Repository } from 'typeorm';
import { ProductEntity } from '../../../infraestructure/postgres/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../../infraestructure/api-rest/dtos/product.dto';
import { IPaymentService } from '../ports/inbound/payment.service.interface';
import { IImageService } from '../ports/inbound/image.service.interface';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<ProductEntity>;
  let paymentService: IPaymentService;
  let imageService: IImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'IPaymentService',
          useValue: {
            createProduct: jest.fn(),
            deleteProduct: jest.fn(),
            updateProduct: jest.fn(),
          },
        },
        {
          provide: 'IImageService',
          useValue: {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    paymentService = module.get<IPaymentService>('IPaymentService');
    imageService = module.get<IImageService>('IImageService');
  });

  const name = 'Product name';
  const price: number = 100;
  const description = 'Product Description';
  const image = 'https://example.com/image.jpg';
  const section = 'Product Section';
  const paymentId = 'stripe_product_123';
  const file: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'producto.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('contenido_simulado_de_imagen'),
    size: 1024,
  } as Express.Multer.File;

  const product = {
    id: expect.any(String),
    name,
    description,
    image,
    price,
    section,
    paymentId,
  };

  const createProductDto = new CreateProductDto(
    name,
    description,
    price,
    section,
  );

  const updateProductDto = new UpdateProductDto(
    name,
    description,
    price,
    section,
  );

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([product]);

      const products = await productService.findAllProducts();
      expect(products).toEqual([product]);
      expect(productRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no products are found', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      const products = await productService.findAllProducts();
      expect(products).toEqual([]);
      expect(productRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(productRepository, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(productService.findAllProducts()).rejects.toThrow(
        'Database error',
      );
      expect(productRepository.find).toHaveBeenCalled();
    });
  });

  describe('findProductById', () => {
    it('should return product with the id', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      const products = await productService.findProductById(expect.any(String));
      expect(products).toEqual(product);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        productService.findProductById(expect.any(String)),
      ).rejects.toThrow('Database error');
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
    });

    it('should throw an error when it happens', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        productService.findProductById(expect.any(String)),
      ).rejects.toThrow(Error);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(paymentService, 'createProduct')
        .mockResolvedValue({ id: paymentId });
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => product as ProductEntity);
      jest
        .spyOn(productRepository, 'save')
        .mockImplementation(() => Promise.resolve(product as ProductEntity));

      const result = await productService.createProduct(createProductDto, file);

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(paymentService.createProduct).toHaveBeenCalledWith(
        createProductDto.name,
        createProductDto.description,
        image,
        createProductDto.price,
      );
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        image: image,
        paymentId: paymentId,
      });
      expect(productRepository.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(product);
    });

    it('should throw an error when product name already exists', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(paymentService, 'createProduct')
        .mockResolvedValue({ id: paymentId });
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => product as ProductEntity);
      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error());
      });

      try {
        await productService.createProduct(createProductDto, file);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(paymentService.createProduct).toHaveBeenCalledWith(
        createProductDto.name,
        createProductDto.description,
        image,
        createProductDto.price,
      );
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        image: image,
        paymentId: paymentId,
      });
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if upload image fails', async () => {
      jest
        .spyOn(imageService, 'uploadImage')
        .mockRejectedValue(new Error('Upload failed'));

      const result = await productService.createProduct(createProductDto, file);

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(result).toBeUndefined();
    });

    it('should throw an error if create product on stripe fails', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(paymentService, 'createProduct')
        .mockRejectedValue(new Error('Product creation on Stripe failed'));

      const result = await productService.createProduct(createProductDto, file);

      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(paymentService.createProduct).toHaveBeenCalledWith(
        createProductDto.name,
        createProductDto.description,
        image,
        createProductDto.price,
      );
      expect(result).toBeUndefined();
    });

    it('should throw an error if creation on database fails', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(paymentService, 'createProduct')
        .mockResolvedValue({ id: paymentId });
      jest.spyOn(productRepository, 'create').mockImplementation(() => {
        throw new Error('Create error');
      });

      try {
        await productService.createProduct(createProductDto, file);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Create error');
      }
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(paymentService.createProduct).toHaveBeenCalledWith(
        createProductDto.name,
        createProductDto.description,
        image,
        createProductDto.price,
      );
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        image: image,
        paymentId: paymentId,
      });
    });

    it('should throw an error if save on database fails', async () => {
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(paymentService, 'createProduct')
        .mockResolvedValue({ id: paymentId });
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => product as ProductEntity);
      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await productService.createProduct(createProductDto, file);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(paymentService.createProduct).toHaveBeenCalledWith(
        createProductDto.name,
        createProductDto.description,
        image,
        createProductDto.price,
      );
      expect(productRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        image: image,
        paymentId: paymentId,
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product with file', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity)
        .mockResolvedValue(product as ProductEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(paymentService, 'updateProduct')
        .mockResolvedValue({ id: paymentId });

      const result = await productService.updateProduct(
        'id',
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        ...updateProductDto,
        image,
      });
      expect(paymentService.updateProduct).toHaveBeenCalledWith(
        product.id,
        updateProductDto.name,
        updateProductDto.description,
        image,
        updateProductDto.price,
      );
      expect(result).toEqual(product);
    });

    it('should update a product with no file', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity)
        .mockResolvedValue(product as ProductEntity);
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(paymentService, 'updateProduct')
        .mockResolvedValue({ id: paymentId });

      const result = await productService.updateProduct(
        'id',
        updateProductDto,
        null,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(paymentService.updateProduct).toHaveBeenCalledWith(
        product.id,
        updateProductDto.name,
        updateProductDto.description,
        product.image,
        updateProductDto.price,
      );
      expect(result).toEqual(product);
    });

    it('should throw an Error when no product is found to update', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(result).toBeUndefined();
    });

    it('should throw an Error when delete image fails', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity);
      jest
        .spyOn(imageService, 'deleteImage')
        .mockRejectedValue(new Error('Error'));

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(result).toBeUndefined();
    });

    it('should throw an Error when upload image fails', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest
        .spyOn(imageService, 'uploadImage')
        .mockRejectedValue(new Error('Error'));

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(result).toBeUndefined();
    });

    it('should throw an error on update method when it happens with File', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest.spyOn(productRepository, 'update').mockRejectedValue(new Error());

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        ...updateProductDto,
        image,
      });
      expect(result).toBeUndefined();
    });

    it('should throw an error on update method when it happens with no File', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity);
      jest.spyOn(productRepository, 'update').mockRejectedValue(new Error());

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        null,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        ...updateProductDto,
        image: product.image,
      });
      expect(result).toBeUndefined();
    });

    it('should throw an Error when on update Product on payment service fails', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as ProductEntity);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(paymentService, 'updateProduct')
        .mockRejectedValue(new Error());

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        ...updateProductDto,
        image,
      });
      expect(paymentService.updateProduct).toHaveBeenCalledWith(
        product.id,
        updateProductDto.name,
        updateProductDto.description,
        image,
        updateProductDto.price,
      );
      expect(result).toBeUndefined();
    });

    it('should throw an Error when no product is found after update with File', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(product as ProductEntity)
        .mockRejectedValueOnce(new Error());
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(imageService, 'uploadImage').mockResolvedValue(image);
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(paymentService, 'updateProduct')
        .mockResolvedValue({ id: paymentId });

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        file,
      );

      expect(productRepository.findOne).toHaveBeenCalledTimes(2);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(imageService.uploadImage).toHaveBeenCalledWith(file);
      expect(productRepository.update).toHaveBeenCalledWith(product.id, {
        ...updateProductDto,
        image,
      });
      expect(paymentService.updateProduct).toHaveBeenCalledWith(
        product.id,
        updateProductDto.name,
        updateProductDto.description,
        image,
        updateProductDto.price,
      );
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(result).toBeUndefined();
    });

    it('should throw an Error when no product is found after update with no File', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValueOnce(product as ProductEntity)
        .mockRejectedValueOnce(new Error());
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(paymentService, 'updateProduct')
        .mockResolvedValue({ id: paymentId });

      const result = await productService.updateProduct(
        product.id,
        updateProductDto,
        null,
      );

      expect(productRepository.findOne).toHaveBeenCalledTimes(2);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(paymentService.updateProduct).toHaveBeenCalledWith(
        product.id,
        updateProductDto.name,
        updateProductDto.description,
        product.image,
        updateProductDto.price,
      );
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product when product exists', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(paymentService, 'deleteProduct').mockResolvedValue(undefined);
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await productService.deleteProduct(product.id);

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(paymentService.deleteProduct).toHaveBeenCalledWith(
        product.paymentId,
      );
      expect(productRepository.delete).toHaveBeenCalledWith(product.id);
      expect(result).toEqual({
        message: `Product with id ${product.id} was deleted.`,
      });
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());
      await expect(productService.deleteProduct(product.id)).rejects.toThrow(
        Error,
      );
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
    });

    it('should throw error when delete method throws an error', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest.spyOn(paymentService, 'deleteProduct').mockResolvedValue(undefined);
      jest.spyOn(productRepository, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await expect(productService.deleteProduct(product.id)).rejects.toThrow(
        'Error',
      );
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(paymentService.deleteProduct).toHaveBeenCalledWith(
        product.paymentId,
      );
    });

    it('should throw error when delete image throws an error', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest
        .spyOn(imageService, 'deleteImage')
        .mockRejectedValue(new Error('Error'));

      await expect(productService.deleteProduct(product.id)).rejects.toThrow(
        'Error',
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(paymentService.deleteProduct).not.toHaveBeenCalled();
    });

    it('should throw error when delete stripe product throws an error', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(imageService, 'deleteImage').mockResolvedValue(undefined);
      jest
        .spyOn(paymentService, 'deleteProduct')
        .mockRejectedValue(new Error('Error'));

      await expect(productService.deleteProduct(product.id)).rejects.toThrow(
        'Error',
      );

      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
      });
      expect(imageService.deleteImage).toHaveBeenCalledWith(product.image);
      expect(paymentService.deleteProduct).toHaveBeenCalledWith(
        product.paymentId,
      );
    });
  });
});
