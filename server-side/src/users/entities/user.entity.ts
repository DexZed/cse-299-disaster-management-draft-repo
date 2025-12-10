import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  Affected = 'affected',
  Volunteer = 'volunteer',
  Victim = 'victim',
}

@Schema({ timestamps: true, versionKey: false })
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  password: string;
  @Prop()
  phone: string;
  @Prop()
  address: string;

  @Prop({ enum: Role, default: Role.USER })
  role: string;
  @Prop()
  isAvailable?: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: { type: [Number], default: undefined },
  })
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ currentLocation: '2dsphere' });


// @Prop({ required: true, minlength: 8,match: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/})
//   @MinLength(8)
//   @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, {
//     message: 'Password must contain at least one uppercase letter, one number, and one special character',
//   })
//   password: string;
