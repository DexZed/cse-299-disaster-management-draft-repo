import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocationService } from '../location/location.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: false },
  namespace: '/location', // root namespace
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(LocationGateway.name);

  constructor(private readonly locationService: LocationService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Called by controller/service to broadcast
  broadcastLocation(payload: any) {
    // event name: location_update
    this.server.emit('location_update', payload);
  }
  //TODO: FIX update type from interface updateDTO
  // Handle incoming GPS messages from connected clients via WebSocket
  @SubscribeMessage('send_gps')
  async handleSendGps(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    try {
      // Expect payload to contain { user_id, latitude, longitude, accuracy? }
      const updated = await this.locationService.updateLocation(payload);

      const broadcast = {
        user_id: updated.user_id?._id ?? updated.user_id,
        name: updated.user_id?.name ?? null,
        role: updated.user_id?.role ?? null,
        latitude: updated.latitude,
        longitude: updated.longitude,
        updated_at: updated.updated_at,
        description: updated.description,
        helpType: updated.helpType,
        priority: updated.priority,
        image: updated.image,
      };

      // Broadcast to everyone listening for live updates
      this.server.emit('location_update', broadcast);

      // Acknowledge sender with the stored/normalized location
      client.emit('location_ack', { status: 'ok', location: broadcast });
      return { status: 'ok' };
    } catch (err: any) {
      this.logger.error('Error processing send_gps', err?.message ?? err);
      client.emit('location_error', { message: err?.message ?? 'Error' });
      return { status: 'error', message: err?.message ?? 'Error' };
    }
  }
}
export default LocationGateway;