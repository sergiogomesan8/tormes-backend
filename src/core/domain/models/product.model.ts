import { Exclude } from "class-transformer";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  section: string;
  paymentId?: string;
}

export class SerializedProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  section: string;

  @Exclude()
  paymentId: string;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}