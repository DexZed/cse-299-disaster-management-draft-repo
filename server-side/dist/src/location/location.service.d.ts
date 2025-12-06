import { Model } from 'mongoose';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationService {
    private locationModel;
    private userModel;
    private readonly logger;
    constructor(locationModel: Model<any>, userModel: Model<any>);
    updateLocation(dto: UpdateLocationDto): Promise<any>;
    getVolunteers(): Promise<any[]>;
    getAffected(): Promise<any[]>;
    getAllLocations(): Promise<{
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
