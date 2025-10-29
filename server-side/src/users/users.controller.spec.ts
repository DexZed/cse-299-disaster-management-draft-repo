import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(dto => ({ id: '1', ...dto })),
    findAll: jest.fn(() => ['mock-user']),
    findOne: jest.fn(id => ({ id })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the correct payload', () => {
      const dto: CreateUserDto = { name: 'John' } as any;
      expect(controller.create(dto)).toEqual({ id: '1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      expect(controller.findAll()).toEqual(['mock-user']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', () => {
      expect(controller.findOne('123')).toEqual({ id: '123' });
      expect(service.findOne).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const dto: UpdateUserDto = { name: 'Updated' } as any;
      expect(controller.update('123', dto)).toEqual({ id: '123', ...dto });
      expect(service.update).toHaveBeenCalledWith('123', dto);
    });
  });

  describe('remove', () => {
    it('should delete a user', () => {
      expect(controller.remove('123')).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith('123');
    });
  });
});
