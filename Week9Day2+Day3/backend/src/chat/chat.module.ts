import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose'; // Add this import
import { CricketController } from './chat.controller';
import { CricketService } from './chat.service';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { PlayerSchema } from './schemas/player.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: 'PlayerModel', schema: new Schema({}, { strict: false }), collection: 'player_info' },
      { name: 'YearlyPlayerModel', schema: PlayerSchema, collection: 'summaries' }
    ]),
  ],
  controllers: [CricketController],
  providers: [CricketService],
  exports: [CricketService],
})
export class ChatModule {}