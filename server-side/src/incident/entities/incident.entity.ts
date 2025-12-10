import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type IncidentDocument = HydratedDocument<Incident>;

@Schema({ timestamps: true })
export class Incident {
    @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['FOOD', 'MEDICAL', 'RESCUE', 'SHELTER'], required: true })
  resourceType: string;

  @Prop({ required: true })
  unitsRequired: number;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' })
  priority: string;

  @Prop({
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  })
  status: string;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  assignedVolunteers: string[];
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
IncidentSchema.index({ location: '2dsphere' });