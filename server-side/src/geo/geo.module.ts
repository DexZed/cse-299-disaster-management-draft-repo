import { Module } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoGateway } from './geo.gateway';

@Module({
  providers: [GeoGateway, GeoService],
})
export class GeoModule {}
