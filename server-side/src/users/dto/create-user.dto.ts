import { createZodDto } from 'nestjs-zod';

import { z } from 'zod';
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one number, and one special character'
    ),
  role: z.enum(['admin', 'user', 'affected', 'volunteer']),
});


export class CreateUserDto extends createZodDto(UserSchema){}
