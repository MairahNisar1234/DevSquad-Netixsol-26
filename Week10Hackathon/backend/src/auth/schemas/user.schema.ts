import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class User extends Document {
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  password!: string; // This will store the Bcrypt hash

  @Prop({ 
    required: true, 
    enum: ['teacher', 'student'], 
    default: 'student' 
  })
  role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);