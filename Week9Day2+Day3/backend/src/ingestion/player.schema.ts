import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player extends Document {
  @Prop() player_id!: number;
  @Prop() year!: number;
  @Prop() matches_played!: number;
  @Prop() runs!: number;
  @Prop() highest_score!: number;
  @Prop() bat_avg!: number;
  @Prop() centuries!: number;
  @Prop() wickets!: number;
  @Prop() best_bowl_wickets!: number;
  @Prop() best_bowl_runs!: number;
  @Prop() match_format!: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);