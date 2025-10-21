import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    const params = new Types.ObjectId(id);
    return await this.userModel.findById(params);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const params = new Types.ObjectId(id);

    return await this.userModel.findByIdAndUpdate(params, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const params = new Types.ObjectId(id);

    return await this.userModel.findByIdAndDelete(params);
  }
}
