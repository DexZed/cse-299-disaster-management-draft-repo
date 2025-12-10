import {z} from 'zod';
import {createZodDto} from 'nestjs-zod';
export const mongoSafeString = z
  .string()
  .refine(val => !val.includes('$') && !val.includes('.'), {
    message: 'Invalid characters',
  });

const ResourcesSchema = z.object({
    name: mongoSafeString.optional(),
    description: mongoSafeString.optional(),
    quantity: z.number().optional(),
    status: z.enum(['In-Use', 'Assigned', 'Out of Stock', 'Available']).optional(),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
    image: z.string().optional(),
    expiryDate: z.date().optional(),

});


export class CreateResourceDto extends createZodDto(ResourcesSchema){}
