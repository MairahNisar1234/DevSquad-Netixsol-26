import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(productData: any): Promise<Product> {
    const newProduct = new this.productModel(productData);
    const savedProduct = await newProduct.save();

    // --- NEW PRODUCT NOTIFICATION ---
    // Broadcasts to all connected users that a new item is available
    this.notificationsGateway.broadcastNewProduct(
      savedProduct.name,
      savedProduct.category || 'New Arrivals'
    );

    return savedProduct;
  }

  async findAll(query: any): Promise<Product[]> {
    return this.productModel.find(query).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateData: any): Promise<Product> {
    // Find and update in one go. { new: true } returns the document AFTER the update.
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }

    // --- Flash Sale Notification Logic (Kept Original Logic) ---
    const isSaleActive = updateData.isOnSale === true || updateData.isOnSale === 'true';

    console.log(`Update process for: ${updatedProduct.name}`);
    
    if (isSaleActive) {
      console.log('Sending Flash Sale WebSocket notification...');
      this.notificationsGateway.sendSaleNotification(
        updatedProduct.name,
        updatedProduct.discountPercentage,
      );
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    
    return { message: 'Product deleted successfully' };
  }
  // Inside product.service.ts

async addReview(productId: string, reviewData: { userName: string, rating: number, comment: string }) {
  const product = await this.productModel.findById(productId);

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  product.reviews.push(reviewData as any);

  product.numReviews = product.reviews.length;

  
  const totalRating = product.reviews.reduce((sum, item) => item.rating + sum, 0);
  product.averageRating = parseFloat((totalRating / product.numReviews).toFixed(1));

  await product.save();
  return product;
}
}