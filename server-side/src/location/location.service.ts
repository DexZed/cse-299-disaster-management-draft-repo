import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    const userObjectId = new Types.ObjectId(dto.user_id);

    const updateData: any = {
      description: dto.description,
      helpType: dto.helpType,
      priority: dto.priority,
      latitude: dto.latitude,
      longitude: dto.longitude,
      accuracy: dto.accuracy,
      image: dto.image,
      updated_at: new Date(),
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );

    return this.locationModel.findOneAndUpdate(
      { user_id: dto.user_id },
      { 
        ...dto,
        updated_at: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  // Get ALL affected people
  async getAffectedPeople() {
    return this.locationModel.find();
  }

  // Get single user location
  async getLocationById(user_id: string) {
    return this.locationModel.findOne({ user_id: { $eq: user_id } });
  }
}
