import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ required: true })
  fileName!: string;

  @Prop({ required: true })
  studentName!: string;

  @Prop({ required: true })
  rollNumber!: string;

  @Prop({ required: true })
  score!: number;

  @Prop()
  remarks!: string;

  /**
   * 🔥 FIX: proper reference
   */
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  teacherId!: Types.ObjectId;

  @Prop({ default: 'loose' })
  markingMode!: string;
  @Prop({ required: true })
assignmentTitle!: string;
}

export const SubmissionSchema =
  SchemaFactory.createForClass(Submission);