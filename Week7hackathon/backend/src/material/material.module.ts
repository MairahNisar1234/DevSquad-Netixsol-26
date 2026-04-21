import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { Material, MaterialSchema } from './schemas/material.schema';

@Module({
  imports: [
    // This line registers the schema so the Service can inject it
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema }
    ]),
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
  // We export it so the Products and Orders modules can "see" the Material model
  exports: [MaterialService, MongooseModule], 
})
export class MaterialModule {}