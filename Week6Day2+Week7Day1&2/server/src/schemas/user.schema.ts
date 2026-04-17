import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: false })
  password!: string;

  @Prop({ default: 0 })
  loyaltyPoints!: number;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({ default: 'local' })
  provider!: string;

  @Prop()
  providerId!: string;

  @Prop()
  avatar!: string;

  

  @Prop()
  lastLogin!: Date;

  @Prop({
    type: [
      {
        provider: String,
        loginAt: Date,
      },
    ],
    default: [],
  })
  loginHistory!: {
    provider: string;
    loginAt: Date;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);