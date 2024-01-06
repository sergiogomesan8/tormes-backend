import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../../../core/domain/services/product.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
  const imageMock = { filename: 'test.jpg' } as Express.Multer.File;

  const product = {
    id: expect.any(String),
    name,
    price,
    description,
    image: imageMock.filename,
    section,
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
    imageMock,
  );

  describe('findAllProducts', () => {
    it('should return an array of products', async () => {
      jest
        .spyOn(productService, 'findAllProducts')
        .mockResolvedValue([product]);
      expect(await productController.findAllProducts()).toEqual([product]);
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
      expect(await productController.findProductById(expect.any(String))).toBe(
        product,
      );
      expect(productService.findProductById).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should return a NotFoundException if product was not found', () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockRejectedValue(new NotFoundException());

      return expect(
        productController.findProductById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
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
    it('should create a product and should save the file in the correct location', async () => {
      jest.spyOn(productService, 'createProduct').mockResolvedValue(product);

      expect(
        await productController.createProduct(imageMock, createProductDto),
      ).toBe(product);
      expect(productService.createProduct).toHaveBeenCalledWith({
        ...createProductDto,
        image: imageMock.filename,
      });
    });

    it('should return an Http Exception error when it happens', () => {
      jest
        .spyOn(productService, 'createProduct')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.createProduct(imageMock, createProductDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      jest.spyOn(productService, 'findProductById').mockResolvedValue(product);
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(product);

      expect(
        await productController.updateProduct(
          imageMock,
          expect.any(String),
          updateProductDto,
        ),
      ).toBe(product);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        expect.any(String),
        {
          ...updateProductDto,
          image: imageMock.filename,
        },
      );
    });

    it('should update a product without a file', async () => {
      jest.spyOn(productService, 'findProductById').mockResolvedValue(product);
      jest.spyOn(productService, 'updateProduct').mockResolvedValue(product);

      const updateProductDtoWithoutFile = new UpdateProductDto('New name');

      expect(
        await productController.updateProduct(
          null,
          expect.any(String),
          updateProductDtoWithoutFile,
        ),
      ).toBe(product);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        expect.any(String),
        updateProductDtoWithoutFile,
      );
    });

    it('should return an Http Exception error when it happens', () => {
      jest.spyOn(productService, 'findProductById').mockResolvedValue(product);
      jest
        .spyOn(productService, 'updateProduct')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.updateProduct(
          imageMock,
          expect.any(String),
          updateProductDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest.spyOn(productService, 'findProductById').mockResolvedValue(product);
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
      jest.spyOn(productService, 'findProductById').mockResolvedValue(product);
      jest
        .spyOn(productService, 'deleteProduct')
        .mockRejectedValue(new InternalServerErrorException());

      return expect(
        productController.deleteProduct(expect.any(String)),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
