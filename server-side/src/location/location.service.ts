import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
import UpdateLocationDto from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  // Create or update location
  async updateLocation(dto: UpdateLocationDto) {
    // Whitelist only the desired fields to be updated.
    const allowedFields = ['latitude', 'longitude', 'status', 'otherField'];
    const update: Partial<Location> = {};
    for (const key of allowedFields) {
      if (key in dto) {
        update[key] = dto[key];
      }
    }
    update.updated_at = new Date();
    return this.locationModel.findOneAndUpdate(
      { user_id: dto.user_id },
      update,
      { upsert: true, new: true }
    );
  }

  // Get ALL affected people
  async getAffectedPeople() {
    return this.locationModel.find();
  }

  // Get a single location by user_id
  async getLocationById(user_id: string) {
    return this.locationModel.findOne({ user_id: { $eq: user_id } });
  }
}
