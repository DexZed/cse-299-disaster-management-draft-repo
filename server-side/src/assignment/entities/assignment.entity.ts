import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type AssignmentDocument = HydratedDocument<Assignment>;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ type: Types.ObjectId, ref: 'Incident', required: true })
  incidentId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  volunteerId: string;

  @Prop({
    enum: ['ASSIGNED', 'ON_ROUTE', 'COMPLETED'],
    default: 'ASSIGNED',
  })
  status: string;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
