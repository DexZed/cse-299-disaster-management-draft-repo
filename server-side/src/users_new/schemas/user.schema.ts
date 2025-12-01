import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['victim', 'volunteer'], default: 'victim' })
  role: string;

  @Prop()
  name?: string;

  @Prop()
  displayName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export default User;
