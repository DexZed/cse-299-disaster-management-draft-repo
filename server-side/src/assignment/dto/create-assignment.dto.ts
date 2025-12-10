import { createZodDto } from 'nestjs-zod';
import { z } from 'zod'
export const UpdateAssignmentStatusDTO = z.object({
  status: z.enum(['ON_ROUTE', 'COMPLETED'])
});
export class UpdateAssignmentStatusDto extends createZodDto(UpdateAssignmentStatusDTO){}