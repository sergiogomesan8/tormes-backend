import { CreateProductDto, UpdateProductDto } from './product.dto';

describe('ProductDto', () => {
  it('should create a CreateProductDto object', () => {
    const name = 'Example Product';
    const description = 'This is an example product.';
    const price = 100;
    const section = 'Example Section';

    const createProductDto = new CreateProductDto(
      name,
      description,
      price,
      section,
    );

    expect(createProductDto).toBeDefined();
    expect(createProductDto.name).toBe(name);
    expect(createProductDto.description).toBe(description);
    expect(createProductDto.price).toBe(price);
    expect(createProductDto.section).toBe(section);
  });
});

describe('UpdateProductDto', () => {
  it('should create a UpdateProductDto object', () => {
    const name = 'Example Product';
    const description = 'This is an example product.';
    const price = 100;
    const section = 'Example Section';

    const updateProductDto = new UpdateProductDto(
      name,
      description,
      price,
      section,
    );

    expect(updateProductDto).toBeDefined();
    expect(updateProductDto.name).toBe(name);
    expect(updateProductDto.description).toBe(description);
    expect(updateProductDto.price).toBe(price);
    expect(updateProductDto.section).toBe(section);
  });
});
