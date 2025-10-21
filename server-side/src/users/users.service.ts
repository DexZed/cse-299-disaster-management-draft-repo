import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  async create(createUserDto: CreateUserDto) {
     const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();

  }

  async  findAll() {
    return await this.userModel.find();

  }

  async findOne(id: string) {
 const params = new Types.ObjectId(id);
    return await this.userModel.findById(params);
  }


 update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
