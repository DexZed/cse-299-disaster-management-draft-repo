import { Body, Controller, Get, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationGateway } from '../gateway/location.gateway';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly gateway: LocationGateway,
  ) {}

  @Post('update')
  async update(@Body() body: UpdateLocationDto) {
    try {
      const updated = await this.locationService.updateLocation(body);
      // Broadcast to WebSocket clients (frontend map listeners)
      this.gateway.broadcastLocation({
        user_id: updated.user_id._id ?? updated.user_id,
        name: updated.user_id?.name ?? null,
        role: updated.user_id?.role ?? null,
        latitude: updated.latitude,
        longitude: updated.longitude,
        updated_at: updated.updated_at,
      });
      return { message: 'Location updated', location: updated };
    } catch (err) {
      throw new HttpException(err.message || 'Error', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('volunteers')
  getVolunteers() {
    return this.locationService.getVolunteers();
  }

  @Get('affected')
  getAffected() {
    return this.locationService.getAffected();
  }

  @Get('all')
  getAll() {
    return this.locationService.getAllLocations();
  }
}
