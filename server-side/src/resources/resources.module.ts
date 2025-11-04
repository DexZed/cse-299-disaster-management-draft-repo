import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resources, ResourcesSchema } from './entities/resource.entity';

@Module({
  imports: [MongooseModule.forFeature([{
    name:Resources.name,
    schema:ResourcesSchema
  }])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
