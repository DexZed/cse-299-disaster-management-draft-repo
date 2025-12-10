import { createZodDto } from 'nestjs-zod';
import { mongoSafeString } from '../../resources/dto/create-resource.dto';
import { z } from 'zod';
// const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
const UserSchema = z.object({
  name: mongoSafeString.optional(),
  phone: mongoSafeString.optional(),
  address: mongoSafeString.optional(),
  email: z.email().optional(),
  password: mongoSafeString.optional(),
  role: z.enum(['admin', 'user', 'affected', 'volunteer','victim']).optional(),
  profileImage: mongoSafeString.optional(),
  isAuthenticated: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
});


export class CreateUserDto extends createZodDto(UserSchema){}
