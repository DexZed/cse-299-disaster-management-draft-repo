import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, Matches, MinLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  Affected = 'affected',
  Volunteer = 'volunteer',
}
@Schema({timestamps: true,versionKey: false})
@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true})
  @IsEmail()
  email: string;

  @Prop({ required: true, minlength: 8,match: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/})
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, {
    message: 'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password: string;

  @Prop({ required: true, enum: Role, default: Role.USER })
  role: string;

  @Prop()
  profileImage?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
