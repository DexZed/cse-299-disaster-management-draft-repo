import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CatchEverythingFilter } from './Global Erro Handler/globalErrorHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist:true,
  //   forbidNonWhitelisted:true,
  //   transform:true
  // }))
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
