import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GeoService } from './geo.service';
import { CreateGeoDto } from './dto/create-geo.dto';
import { UpdateGeoDto } from './dto/update-geo.dto';

@WebSocketGateway()
export class GeoGateway {
  constructor(private readonly geoService: GeoService) {}

  @SubscribeMessage('createGeo')
  create(@MessageBody() createGeoDto: CreateGeoDto) {
    return this.geoService.create(createGeoDto);
  }

  @SubscribeMessage('findAllGeo')
  findAll() {
    return this.geoService.findAll();
  }

  @SubscribeMessage('findOneGeo')
  findOne(@MessageBody() id: number) {
    return this.geoService.findOne(id);
  }

  @SubscribeMessage('updateGeo')
  update(@MessageBody() updateGeoDto: UpdateGeoDto) {
    return this.geoService.update(updateGeoDto.id, updateGeoDto);
  }

  @SubscribeMessage('removeGeo')
  remove(@MessageBody() id: number) {
    return this.geoService.remove(id);
  }
}
