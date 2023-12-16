import { CreateProductDto, ProductDto, UpdateProductDto } from './product.dto';

describe('ProductDto', () => {
  it('should create a ProductDto object', () => {
    const id = 'product-1';
    const name = 'Example Product';
    const description = 'This is an example product.';
    const image = 'https://example.com/image.jpg';
    const price = 100;
    const section = 'Example Section';

    const productDto = new ProductDto(
      id,
      name,
      description,
      image,
      price,
      section,
    );

    expect(productDto).toBeDefined();
    expect(productDto.id).toBe(id);
    expect(productDto.name).toBe(name);
    expect(productDto.description).toBe(description);
    expect(productDto.image).toBe(image);
    expect(productDto.price).toBe(price);
    expect(productDto.section).toBe(section);
  });
});

describe('ProductDto', () => {
  it('should create a CreateProductDto object', () => {
    const name = 'Example Product';
    const description = 'This is an example product.';
    const image = 'https://example.com/image.jpg';
    const price = 100;
    const section = 'Example Section';

    const productDto = new CreateProductDto(
      name,
      description,
      image,
      price,
      section,
    );

    expect(productDto).toBeDefined();
    expect(productDto.name).toBe(name);
    expect(productDto.description).toBe(description);
    expect(productDto.image).toBe(image);
    expect(productDto.price).toBe(price);
    expect(productDto.section).toBe(section);
  });
});

describe('UpdateProductDto', () => {
  it('should create a UpdateProductDto object', () => {
    const name = 'Example Product';
    const description = 'This is an example product.';
    const image = 'https://example.com/image.jpg';
    const price = 100;
    const section = 'Example Section';

    const productDto = new UpdateProductDto(
      name,
      description,
      image,
      price,
      section,
    );

    expect(productDto).toBeDefined();
    expect(productDto.name).toBe(name);
    expect(productDto.description).toBe(description);
    expect(productDto.image).toBe(image);
    expect(productDto.price).toBe(price);
    expect(productDto.section).toBe(section);
  });
});
