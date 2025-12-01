import { createZodDto } from 'nestjs-zod';

import { z } from 'zod';
// const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(['admin', 'user', 'affected', 'volunteer']),
});


export class CreateUserDto extends createZodDto(UserSchema){}
