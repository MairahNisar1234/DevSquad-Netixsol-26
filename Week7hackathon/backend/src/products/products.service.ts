import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/products.schema';
import { Material } from '../material/schemas/material.schema';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Material.name) private materialModel: Model<Material>,
  ) {}

  async create(productDto: any): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    return await newProduct.save();
  }

 async getAvailableProducts() {
  this.logger.log('--- STARTING CALCULATED STOCK CHECK ---');
  
  const products = await this.productModel.find().populate('recipe.materialId');
  
  return products.map(product => {
    let maxPossible = Infinity;
    let hasRequiredIngredients = false;
    const productObj = product.toObject();

    product.recipe.forEach((item) => {
      // Cast materialId as 'any' to access fields safely
      const material = item.materialId as any; 
      
      // 1. Check if population worked
      if (!material || typeof material !== 'object') {
        this.logger.warn(`⚠️ ${product.name}: Material not populated or missing!`);
        return; 
      }

      // 2. Skip Optionals
      if (item.isOptional === true) return; 

      // 3. Logic for Required Items
      hasRequiredIngredients = true;
      
      // Force conversion to numbers to avoid NaN errors
      const stock = Number(material.stockQuantity);
      const needs = Number(item.quantityNeeded);

      if (isNaN(stock) || isNaN(needs) || needs <= 0) {
        this.logger.error(`❌ Data Error: ${material.name} has invalid numbers.`);
        maxPossible = 0;
        return;
      }

      const possible = Math.floor(stock / needs);
      
      this.logger.log(`Dish: ${product.name} | Needs: ${needs} ${material.name} | Can make: ${possible}`);

      if (possible < maxPossible) {
        maxPossible = possible;
      }
    });

    // Final safety check
    const finalStock = (maxPossible === Infinity || !hasRequiredIngredients) ? 0 : maxPossible;

    return {
      ...productObj,
      available: finalStock, 
    };
  });
}
  async delete(id: string): Promise<any> {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updateProductDto: any): Promise<Product> {
    this.logger.log(`Updating product ${id}...`);
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }
} // End of Class