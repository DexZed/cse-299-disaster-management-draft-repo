import { HelpType, Priority } from "../schemas/location.schema";

export class UpdateLocationDto {
  readonly user_id?: string;
  readonly name?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly description?: string;
  readonly accuracy?: number;
  readonly priority?: Priority;
  readonly helpType?: HelpType;
  readonly image?: string;
}

export default UpdateLocationDto;