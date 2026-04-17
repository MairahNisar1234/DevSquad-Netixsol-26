import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true }) name!: string;
  @Prop({ unique: true, required: true }) email!: string;
  @Prop({ required: true }) password!: string;
  @Prop({ default: 0 }) balance!: number;

  // --- Address Fields ---
  @Prop() country!: string;
  @Prop() city!: string;
  @Prop() address1!: string;
  @Prop() address2!: string;
  @Prop() landline!: string;
  @Prop() poBox!: string;

  // --- Traffic File Fields ---
  @Prop() trafficType!: string;
  @Prop() plateState!: string;
  @Prop() plateCode!: string;
  @Prop() trafficFileNo!: string;
  @Prop() plateNumber!: string;
  @Prop() driverLicense!: string;
  @Prop() issueCity!: string;

@Prop({ default: '/avatar-placeholder.png' })
avatar!: string; 
}

export const UserSchema = SchemaFactory.createForClass(User);