import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { QueryFailedError, Repository } from 'typeorm';
import { ProductEntity } from '../../../infraestructure/postgres/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../../infraestructure/api-rest/dtos/product.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  const name = 'Product name';
  const price: number = 100;
  const description = 'Product Description';
  const image = 'https://example.com/image.jpg';
  const section = 'Product Section';

  const product = {
    id: expect.any(String),
    name,
    price,
    description,
    image,
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
    image,
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
      expect(productRepository.findOne).toHaveBeenCalled();
    });

    it('should return NotFoundException when product does not exists', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        productService.findProductById(expect.any(String)),
      ).rejects.toThrow(NotFoundException);
      expect(productRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error if the database query fails', async () => {
      jest
        .spyOn(productRepository, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        productService.findProductById(expect.any(String)),
      ).rejects.toThrow('Database error');
      expect(productRepository.findOne).toHaveBeenCalled();
    });

    it('should throw an error when it happens', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

      await expect(
        productService.findProductById(expect.any(String)),
      ).rejects.toThrow(Error);
      expect(productRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => product as any);
      jest
        .spyOn(productRepository, 'save')
        .mockImplementation(() => Promise.resolve(product as any));

      expect(await productService.createProduct(createProductDto)).toEqual(
        product,
      );
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw ConflictException when product name already exists', async () => {
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => product as any);
      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw new QueryFailedError('query', [], new Error());
      });

      try {
        await productService.createProduct(createProductDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toEqual('Product with this name already exists');
      }
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(productRepository, 'create').mockImplementation(() => {
        throw new Error('Create error');
      });

      try {
        await productService.createProduct(createProductDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Create error');
      }
    });

    it('should throw an error if save fails', async () => {
      jest
        .spyOn(productRepository, 'create')
        .mockImplementation(() => product as any);
      jest.spyOn(productRepository, 'save').mockImplementation(() => {
        throw new Error('Save error');
      });

      try {
        await productService.createProduct(createProductDto);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty('message', 'Save error');
      }
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(product as any);

      const result = await productService.updateProduct('id', updateProductDto);
      expect(result).toEqual(product);
      expect(productRepository.update).toHaveBeenCalledWith(
        'id',
        updateProductDto,
      );
      expect(productRepository.findOne).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when no product is found to update', async () => {
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(
        productService.updateProduct('id', updateProductDto),
      ).rejects.toThrow(new NotFoundException('Product not found'));
    });

    it('should throw a NotFoundException when the updated product cannot be found', async () => {
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        productService.updateProduct('id', updateProductDto),
      ).rejects.toThrow(
        new NotFoundException('Error retrieving updated product'),
      );
    });

    it('should throw an error on update method when it happens', async () => {
      jest.spyOn(productRepository, 'update').mockRejectedValue(new Error());
      await expect(
        productService.updateProduct('id', updateProductDto),
      ).rejects.toThrow(Error);
      expect(productRepository.update).toHaveBeenCalled();
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());
      await expect(
        productService.updateProduct('id', updateProductDto),
      ).rejects.toThrow(Error);
      expect(productRepository.update).toHaveBeenCalled();
      expect(productRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product when product exists', async () => {
      const productId = 'product-id';
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await productService.deleteProduct(productId);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(productRepository.delete).toHaveBeenCalledWith(productId);
      expect(result).toEqual({
        message: `Product with id ${productId} was deleted.`,
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);
      await expect(productService.deleteProduct('product-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error on findOne method when it happens', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());
      await expect(productService.deleteProduct('product-id')).rejects.toThrow(
        Error,
      );
      expect(productRepository.findOne).toHaveBeenCalled();
    });

    it('should throw error when delete method throws an error', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(productRepository, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });
      await expect(productService.deleteProduct('product-id')).rejects.toThrow(
        'Error',
      );
    });
  });
});
