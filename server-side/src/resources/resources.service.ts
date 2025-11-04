import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resources } from './entities/resource.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class ResourcesService {
  constructor(@InjectModel(Resources.name) private resourcesModel: Model<Resources>){}
  async create(createResourceDto: CreateResourceDto) {
    const createdResource = new this.resourcesModel(createResourceDto);
    return await createdResource.save();
    
  }

 async findAll() {
    return await this.resourcesModel.find();
  }

 async findOne(id: string) {
    const params = new Types.ObjectId(id);
    return await this.resourcesModel.findById(params);
  }

 async update(id: string, updateResourceDto: UpdateResourceDto) {
    const params = new Types.ObjectId(id);
    return await this.resourcesModel.findByIdAndUpdate(params, updateResourceDto, {
      new: true,
    });
  }

 async remove(id: string) {
  const params = new Types.ObjectId(id);
  return await this.resourcesModel.findByIdAndDelete(params);
 
}
}
