import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: { createdAt: false, updatedAt: 'updated_at' } })
export class Location {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  accuracy?: number;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
// Unique index on user_id; sparse allows multiple null values
LocationSchema.index({ user_id: 1 }, { unique: true, sparse: true });
