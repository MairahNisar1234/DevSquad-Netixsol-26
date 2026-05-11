import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Product, ProductSchema } from '../products/schema/product.schema';
import { SymptomMap, SymptomMapSchema } from './symptom-match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },
    { name: SymptomMap.name, schema: SymptomMapSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}