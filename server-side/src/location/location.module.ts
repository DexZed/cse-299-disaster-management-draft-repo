import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location, LocationSchema } from './schemas/location.schema';
import { LocationGateway } from '../gateway/location.gateway';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationGateway],
  exports: [LocationService],
})
export class LocationModule {}
export default LocationModule;