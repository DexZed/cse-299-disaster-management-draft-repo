import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationGateway } from '../gateway/location.gateway';
import { LocationService } from './location.service';
export declare class LocationController {
    private readonly locationService;
    private readonly gateway;
    constructor(locationService: LocationService, gateway: LocationGateway);
    update(body: UpdateLocationDto): Promise<{
        message: string;
        location: any;
    }>;
    getVolunteers(): Promise<any[]>;
    getAffected(): Promise<any[]>;
    getAll(): Promise<{
        user_id: any;
        name: any;
        role: any;
        latitude: any;
        longitude: any;
        updated_at: any;
        description: any;
        helpType: any;
        priority: any;
        image: any;
    }[]>;
}
