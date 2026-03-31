import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // Hide password by default
  password: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' })
  profilePicture: string;

  // Array of User IDs who follow this user
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  followers: Types.ObjectId[];

  // Array of User IDs this user is following
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  following: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);