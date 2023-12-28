import { CreateSectionDto, UpdateSectionDto } from './section.dto';

describe('CreateSectionDto', () => {
  it('should create a CreateSectionDto object', () => {
    const name = 'Example Product';
    const image = 'https://example.com/image.jpg';

    const createProductDto = new CreateSectionDto(name, image);

    expect(createProductDto).toBeDefined();
    expect(createProductDto.name).toBe(name);
    expect(createProductDto.image).toBe(image);
  });
});

describe('UpdateSectionDto', () => {
  it('should create a UpdateProductDto object', () => {
    const name = 'Example Product';
    const image = 'https://example.com/image.jpg';

    const createProductDto = new UpdateSectionDto(name, image);

    expect(createProductDto).toBeDefined();
    expect(createProductDto.name).toBe(name);
    expect(createProductDto.image).toBe(image);
  });
});
