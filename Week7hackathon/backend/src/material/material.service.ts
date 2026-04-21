import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material } from './schemas/material.schema';

@Injectable()
export class MaterialService {
  private readonly logger = new Logger(MaterialService.name);

  constructor(
    @InjectModel(Material.name) private materialModel: Model<Material>,
  ) {}

  // 1. Register New Material
  async create(createMaterialDto: any): Promise<Material> {
    console.log('--- BACKEND: CREATE MATERIAL START ---');
    console.log('Incoming Data from UI:', createMaterialDto);

    const newMaterial = new this.materialModel(createMaterialDto);
    const savedMaterial = await newMaterial.save();

    console.log('Successfully Saved to DB:', savedMaterial);
    console.log('--- BACKEND: CREATE MATERIAL END ---');
    
    this.logger.log(`Registering new raw material: ${createMaterialDto.name}`);
    return savedMaterial;
  }

  // 2. Fetch All Materials
  async findAll(): Promise<Material[]> {
    console.log('--- BACKEND: FETCHING ALL MATERIALS ---');
    const materials = await this.materialModel.find().exec();
    console.log(`Found ${materials.length} items in inventory.`);
    return materials;
  }

  // 3. Find One Material
  async findOne(id: string): Promise<Material> {
    console.log(`--- BACKEND: LOOKING FOR ID: ${id} ---`);
    const material = await this.materialModel.findById(id).exec();
    
    if (!material) {
      console.log('ERROR: Material not found in database.');
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    console.log('Found:', material.name);
    return material;
  }

  // 4. Restock Logic (The Patch request)
  async addStock(id: string, amount: number): Promise<Material> {
    console.log('--- BACKEND: RESTOCK EVENT START ---');
    console.log(`Target ID: ${id}`);
    console.log(`Amount to Add: ${amount}`);

    const material = await this.materialModel.findByIdAndUpdate(
      id,
      { $inc: { stockQuantity: amount } }, // $inc is an atomic MongoDB operator
      { new: true } 
    ).exec();

    if (!material) {
      console.log('RESTOCK FAILED: ID not found.');
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    console.log(`RESTOCK SUCCESS: ${material.name} updated.`);
    console.log(`Old Balance + ${amount} = New Balance: ${material.stockQuantity}`);
    console.log('--- BACKEND: RESTOCK EVENT END ---');

    return material;
  }

  // 5. Delete Material
  async remove(id: string) {
    console.log(`--- BACKEND: DELETING MATERIAL ID: ${id} ---`);
    const result = await this.materialModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      console.log('DELETE FAILED: ID does not exist.');
      return null;
    }

    console.log(`PERMANENTLY REMOVED: ${result.name}`);
    return result;
  }
}