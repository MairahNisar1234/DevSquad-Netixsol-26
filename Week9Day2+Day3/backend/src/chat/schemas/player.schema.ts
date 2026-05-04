import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'players' }) // Ensure this matches your actual collection name
export class Player extends Document {
  @Prop()
  player_id!: number;

  @Prop()
  short_name!: string;

  @Prop()
  full_name!: string;

  @Prop()
  is_active!: string;

  @Prop()
  role!: string;

  @Prop()
  country!: string;

  @Prop()
  batting_style!: string;

  @Prop()
  bowling_style!: string;

  @Prop()
  image_url!: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);