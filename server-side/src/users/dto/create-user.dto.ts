import { createZodDto } from 'nestjs-zod';
import { mongoSafeString } from 'src/resources/dto/create-resource.dto';

import { z } from 'zod';
// const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
const UserSchema = z.object({
  name: mongoSafeString,
  email: z.email(),
  password: mongoSafeString,
  role: z.enum(['admin', 'user', 'affected', 'volunteer']),
}).strict();


export class CreateUserDto extends createZodDto(UserSchema){}
