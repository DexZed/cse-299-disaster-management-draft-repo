import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async seedUsers() {
    try {
      const count = await this.userModel.countDocuments();
      if (count === 0) {
        this.logger.log('Seeding test users...');

        // Create test victim user
        await this.authService.createOrUpdateUser(
          'victim@test.com',
          'password123',
          'victim',
          'Test Victim',
        );
        this.logger.log('Created test victim: victim@test.com / password123');

        // Create test volunteer user
        await this.authService.createOrUpdateUser(
          'volunteer@test.com',
          'password123',
          'volunteer',
          'Test Volunteer',
        );
        this.logger.log('Created test volunteer: volunteer@test.com / password123');

        // Create admin user
        await this.authService.createOrUpdateUser(
          'admin@test.com',
          'password123',
          'volunteer',
          'Admin User',
        );
        this.logger.log('Created admin user: admin@test.com / password123');
      } else {
        this.logger.log(`Database already has ${count} users, skipping seed`);
      }
    } catch (err) {
      this.logger.error('Failed to seed users:', (err as any)?.message);
    }
  }
}
