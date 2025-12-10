import { createZodDto } from 'nestjs-zod';
import { mongoSafeString } from '../../resources/dto/create-resource.dto';
import { z } from 'zod';
export const CreateIncidentDTO = z.object({
  description: mongoSafeString.optional(),
  resourceType: z.enum(['FOOD', 'MEDICAL', 'RESCUE', 'SHELTER']),
  unitsRequired: z.number().int().positive().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});

export const AssignVolunteerDTO = z.object({
  volunteerIds: z.array(z.string().uuid())
});
export class CreateIncidentDto extends createZodDto(CreateIncidentDTO) {}
export class AssignVolunteerDto extends createZodDto(AssignVolunteerDTO){}
