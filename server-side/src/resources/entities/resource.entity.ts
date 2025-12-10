import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type resourcesDocument = HydratedDocument<Resources>;
export enum Status {
  inUse = 'In-Use',
  assigned = 'Assigned',
  outOfStock = 'Out of Stock',
  available = 'Available',
}
@Schema({ timestamps: true, versionKey: false })
@Schema()
export class Resources {
  @Prop()
  name: string;
  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop({ required: true, enum: Status, default: Status.available })
  status: string;
  @Prop()
  
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  expiryDate: Date;
  @Prop()
  totalUnits: number;

  @Prop()
  availableUnits: number;
}

export const ResourcesSchema = SchemaFactory.createForClass(Resources);
