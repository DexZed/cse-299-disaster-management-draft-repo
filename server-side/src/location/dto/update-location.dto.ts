export class UpdateLocationDto {
  readonly user_id?: string;
  readonly name?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly description?: string;
  readonly accuracy?: number;
}

export default UpdateLocationDto;