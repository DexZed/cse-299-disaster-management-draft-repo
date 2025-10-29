import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = { _id: '1', name: 'John' };

  const mockUserModel = {
    new: jest.fn(),
    constructor: jest.fn(),
    find: jest.fn().mockResolvedValue([mockUser]),
    findById: jest.fn().mockResolvedValue(mockUser),
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      ...mockUser,
      name: 'Updated',
    }),
    findByIdAndDelete: jest.fn().mockResolvedValue({ deleted: true })
  };

  // For new this.userModel(dto)
  const mockUserInstance = {
    save: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: function (dto) {
            return mockUserInstance;
          },
        },
      ],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)
      .compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = { name: 'John' } as any;
      mockUserInstance.save.mockResolvedValue(mockUser);

      // Because constructor is overriden
      jest
        .spyOn(model.prototype, 'save')
        .mockResolvedValueOnce(mockUser as any);

      const result = await service.create(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = new Types.ObjectId().toHexString();
      const result = await service.findOne(id);

      expect(model.findById).toHaveBeenCalledWith(new Types.ObjectId(id));
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = new Types.ObjectId().toHexString();
      const dto: UpdateUserDto = { name: 'Updated' } as any;

      const result = await service.update(id, dto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        new Types.ObjectId(id),
        dto,
        { new: true },
      );
      expect(result).toEqual({ ...mockUser, name: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const id = new Types.ObjectId().toHexString();
      const result = await service.remove(id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(
        new Types.ObjectId(id),
      );
      expect(result).toEqual({ deleted: true });
    });
  });
});
