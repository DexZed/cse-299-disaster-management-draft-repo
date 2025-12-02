import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SeedService } from './seed.service';
import { User, UserSchema } from 'src/users/entities/user.entity';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [AuthService, SeedService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
