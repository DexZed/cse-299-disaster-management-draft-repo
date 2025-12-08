import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocationService } from '../location/location.service';
export declare class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly locationService;
    server: Server;
    private logger;
    constructor(locationService: LocationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastLocation(payload: any): void;
    handleSendGps(payload: any, client: Socket): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
}
export default LocationGateway;
