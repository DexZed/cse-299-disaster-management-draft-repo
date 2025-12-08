import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(createUserDto: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
