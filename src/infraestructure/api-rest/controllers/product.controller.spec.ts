import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../../../core/domain/services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SerializedProduct } from '../../../core/domain/models/product.model';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn(),
            findProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  const name = 'Product name';
  const price: number = 100;
  const description = 'Product Description';
  const section = 'Product Section';
  const image = { filename: 'test.jpg' } as Express.Multer.File;

  const product = {
    id: expect.any(String),
    name,
    price,
    description,
    image: image.filename,
    section,
  };

  const serializedProduct = new SerializedProduct(product);

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
    it('should return an array of products', async () => {
      jest
        .spyOn(productService, 'findAllProducts')
        .mockResolvedValue([product]);
      expect(await productController.findAllProducts()).toEqual([
        serializedProduct,
      ]);
      expect(productService.findAllProducts).toHaveBeenCalled();
    });

    it('should return an empty array if no products are found', async () => {
      jest.spyOn(productService, 'findAllProducts').mockResolvedValue([]);
      expect(await productController.findAllProducts()).toEqual([]);
      expect(productService.findAllProducts).toHaveBeenCalled();
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(productService, 'findAllProducts')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(productController.findAllProducts()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findProductById', () => {
    it('should return a product by id', async () => {
      jest.spyOn(productService, 'findProductById').mockResolvedValue(product);
      expect(
        await productController.findProductById(expect.any(String)),
      ).toStrictEqual(serializedProduct);
      expect(productService.findProductById).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should log an error and return a NotFoundException if product was not found', () => {
      const loggerSpy = jest.spyOn(productController['logger'], 'error');
      jest.spyOn(productService, 'findProductById').mockResolvedValue(null);

      return expect(productController.findProductById(expect.any(String)))
        .rejects.toThrow(NotFoundException)
        .finally(() => {
          expect(loggerSpy).toHaveBeenCalledWith(
            `Product with ${expect.any(String)} not found`,
          );
        });
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.findProductById(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createProduct', () => {
    it('should create a product if file is provided', async () => {
      jest.spyOn(productService, 'createProduct').mockResolvedValue(product);

      expect(
        await productController.createProduct(image, createProductDto),
      ).toStrictEqual(serializedProduct);
      expect(productService.createProduct).toHaveBeenCalledWith(
        createProductDto,
        image,
      );
    });

    it('should throw an error if no file is provided', () => {
      return expect(
        productController.createProduct(null, createProductDto),
      ).rejects.toThrow('No file provided');
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(productService, 'createProduct')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.createProduct(image, createProductDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product if file is provided', async () => {
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(product);

      expect(
        await productController.updateProduct(
          image,
          expect.any(String),
          updateProductDto,
        ),
      ).toStrictEqual(serializedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        expect.any(String),
        updateProductDto,
        image,
      );
    });

    it('should update a product without file provided', async () => {
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(product);

      expect(
        await productController.updateProduct(
          null,
          expect.any(String),
          updateProductDto,
        ),
      ).toStrictEqual(serializedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        expect.any(String),
        updateProductDto,
        null,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(productService, 'updateProduct')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.updateProduct(
          image,
          expect.any(String),
          updateProductDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest.spyOn(productService, 'deleteProduct').mockResolvedValue({
        message: `Product with id ${expect.any(String)} was deleted.`,
      });

      expect(await productController.deleteProduct(expect.any(String))).toEqual(
        {
          message: `Product with id ${expect.any(String)} was deleted.`,
        },
      );
      expect(productService.deleteProduct).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(productService, 'deleteProduct')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.deleteProduct(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
