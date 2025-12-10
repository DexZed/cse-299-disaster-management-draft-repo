import { GeoService } from './geo.service';
import { CreateGeoDto } from './dto/create-geo.dto';
import { UpdateGeoDto } from './dto/update-geo.dto';
export declare class GeoGateway {
    private readonly geoService;
    constructor(geoService: GeoService);
    create(createGeoDto: CreateGeoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(updateGeoDto: UpdateGeoDto): string;
    remove(id: number): string;
}
