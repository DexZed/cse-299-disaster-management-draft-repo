import {z} from 'zod';
import {createZodDto} from 'nestjs-zod';

const ResourcesSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    status: z.enum(['In-Use', 'Assigned', 'Out of Stock', 'Available']),
    location: z.string(),
    expiryDate: z.date().optional(),

});


export class CreateResourceDto extends createZodDto(ResourcesSchema){}
