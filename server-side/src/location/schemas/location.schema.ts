import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;



export enum HelpType {
  FOOD = 'food',
  SHELTER = 'shelter',
  MEDICAL_KIT = 'medical_kit',
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
@Schema({ timestamps: { createdAt: false, updatedAt: 'updated_at' } })
export class Location {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop()
  helpType: HelpType;

  @Prop()
  priority: Priority;

  @Prop()
  image?: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  accuracy?: number;

  @Prop({ default: Date.now })
  updated_at?: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
// Unique index on user_id; sparse allows multiple null values
LocationSchema.index({ user_id: 1 }, { unique: true, sparse: true });
