import Product from "../../db/models/product.model";
import { ProductAttributes } from "../interfaces/product.attributes";

class ProductService {

  public async create(productData: ProductAttributes): Promise<ProductAttributes> {
    const product = await Product.create(productData);
    return product;
  }

  // Get all products
  public async getAll(): Promise<ProductAttributes[]> {
    return Product.findAll();
  }

  // Get a product by ID
  public async getById(id: number): Promise<ProductAttributes | null> {
    return Product.findByPk(id);
  }

  // Update a product by ID
  public async update(userId: number, productData: ProductAttributes): Promise<ProductAttributes | null> {
    const [updated] = await Product.update(productData, { where: { userId } });
    return updated ? this.getById(userId) : null;
  }

  // Delete a product by ID
  public async delete(userId: number): Promise<number> {
    return Product.destroy({ where: { userId } });
  }
}

export default ProductService;
