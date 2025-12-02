import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Location } from './schemas/location.schema';
import { UpdateLocationDto } from './dto/update-location.dto';


@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectModel(Location.name) private locationModel: Model<any>,
    @InjectModel('User') private userModel: Model<any>,
  ) {}

  // Upsert location by user_id
  async updateLocation(dto: UpdateLocationDto) {
    const user_id = dto.user_id;
    const latitude = dto.latitude;
    const longitude = dto.longitude;
    const accuracy = dto.accuracy;
    const description = dto.description;
    const helpType = dto.helpType;
    const priority = dto.priority;
    const image = dto.image;
    const userId = new Types.ObjectId(user_id);

    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new Error('User not found');
    }

    const update = {
      latitude,
      longitude,
      accuracy,
      updated_at: new Date(),
      user_id,
      description,
      helpType,
      priority,
      image,
    };

    const loc = await this.locationModel.findOneAndUpdate(
      { user_id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true, strict: false },
    ).populate('user_id', 'name role');

    this.logger.debug(`Location updated for user ${user_id}`);
    return loc;
  }

  // Get all volunteers with their location
  async getVolunteers() {
    const docs = await this.locationModel.find().populate({
      path: 'user_id',
      match: { role: 'volunteer' },
      select: 'name role',
    });

    // filter out null-populated results
    return docs.filter(d => d.user_id !== null);
  }

  async getAffected() {
    const docs = await this.locationModel.find().populate({
      path: 'user_id',
      match: { role: 'affected' },
      select: 'name role',
    });
    return docs.filter(d => d.user_id !== null);
  }

  // Return a compact format friendly to frontend maps
  async getAllLocations() {
    const docs = await this.locationModel.find().populate('user_id', 'name role');
    return docs.map(d => ({
      user_id: d.user_id?._id ?? null,
      name: d.user_id?.name ?? null,
      role: d.user_id?.role ?? null,
      latitude: d.latitude,
      longitude: d.longitude,
      updated_at: d.updated_at,
      description: d.description,
      helpType: d.helpType,
      priority: d.priority,
      image: d.image,
    }));
  }
}
