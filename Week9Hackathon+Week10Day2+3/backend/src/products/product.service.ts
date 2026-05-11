import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll() {
    return this.productModel.find().exec();
  }

  async searchProducts(query: string) {
    // 1. Basic Title/Intent Search using MongoDB Regex
    // This looks for matches in title OR the symptoms_addressed field
    return this.productModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { symptoms_addressed: { $regex: query, $options: 'i' } }
      ]
    }).exec();
  }
}