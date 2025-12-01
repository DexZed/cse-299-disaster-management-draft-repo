import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type resourcesDocument = HydratedDocument<Resources>;
export enum Status {
  inUse = 'In-Use',
  assigned = 'Assigned',
  outOfStock = 'Out of Stock',
  available = 'Available',
}
@Schema({ timestamps: true, versionKey: false, strict: true })
@Schema()
export class Resources {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, enum: Status, default: Status.available })
  status: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  expiryDate: Date;
}

export const ResourcesSchema = SchemaFactory.createForClass(Resources);
