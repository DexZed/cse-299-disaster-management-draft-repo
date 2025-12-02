import {z} from 'zod';
import {createZodDto} from 'nestjs-zod';
export const mongoSafeString = z
  .string()
  .refine(val => !val.includes('$') && !val.includes('.'), {
    message: 'Invalid characters',
  });

const ResourcesSchema = z.object({
    name: mongoSafeString,
    description: mongoSafeString.optional(),
    quantity: z.number(),
    status: z.enum(['In-Use', 'Assigned', 'Out of Stock', 'Available']),
    longitude: z.number(),
    latitude: z.number(),
    image: z.string().optional(),
    expiryDate: z.date().optional(),

}).strict();


export class CreateResourceDto extends createZodDto(ResourcesSchema){}
