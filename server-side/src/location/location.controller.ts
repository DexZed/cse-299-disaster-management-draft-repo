import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import UpdateLocationDto from './dto/update-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Affected user updates location
  @Post('update')
  async updateLocation(@Body() dto: UpdateLocationDto) {
    return this.locationService.updateLocation(dto);
  }
  

  // Get all affected people (admin + volunteer view)
  @Get('affected')
  async getAffected() {
    return this.locationService.getAffectedPeople();
  }

  // Get a specific user location
  @Get('user')
  async getUserLocation(@Query('user_id') user_id: string) {
    return this.locationService.getLocationById(user_id);
  }
}