import { plainToClass } from "class-transformer";
import { IsEnum, IsNumber, IsString, validateSync } from "class-validator";

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}
class EnvironmentVariable{
  @IsEnum(Environment)
  NODE_ENV:Environment;
  @IsNumber()
  PORT:number;
  @IsString()
  MONGO_DB_URL:string;
  @IsString()
  GEMINI_API_KEY:string;

}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariable,
    config,
    { enableImplicitConversion: true },
  );
const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}