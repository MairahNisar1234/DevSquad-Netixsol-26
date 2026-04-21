import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../products/schemas/products.schema';
import { Material } from '../material/schemas/material.schema';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Material.name) private materialModel: Model<Material>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async processOrder(orderDto: any) {
    this.logger.log('--- New Order Received ---');

    // 1. VALIDATION: Check stock for all items
    for (const item of orderDto.items) {
      const product = await this.productModel.findById(item.productId).populate('recipe.materialId');
      
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found.`);
      }

      for (const ingredient of product.recipe) {
        const material = ingredient.materialId as any as Material;
        const totalRequired = ingredient.quantityNeeded * item.quantity;

        if (material.stockQuantity < totalRequired) {
          throw new BadRequestException(`Insufficient ${material.name}.`);
        }
      }
    }

    // 2. DEDUCTION: Subtract ingredients from inventory
    for (const item of orderDto.items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) continue; 

      for (const ingredient of product.recipe) {
        const deductionAmount = ingredient.quantityNeeded * item.quantity;
        await this.materialModel.findByIdAndUpdate(ingredient.materialId, {
          $inc: { stockQuantity: -deductionAmount },
        });
      }
    }

    // 3. PERSISTENCE: Save order with orderType
    try {
      const newOrder = new this.orderModel({
        items: orderDto.items.map((item: any) => ({
          ...item,
          productId: new Types.ObjectId(item.productId)
        })),
        totalAmount: orderDto.totalAmount,
        status: 'Pending',
        // 🔥 NEW: Map the orderType from the request body
        orderType: orderDto.orderType || 'Dine In', 
        orderDate: new Date()
      });

      const savedOrder = await newOrder.save();
      this.logger.log(`Order ${savedOrder._id} [${savedOrder.orderType}] saved to database.`);
      return savedOrder;
    } catch (error) {
      this.logger.error('Failed to save order record:', error);
      throw new BadRequestException('Inventory updated but order recording failed.');
    }
  }

  async findAll(): Promise<any[]> {
    return await this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }
}