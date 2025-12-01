import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      // Fallback if bcrypt not available (development)
      return password;
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      // Fallback if bcrypt not available
      return password === hash;
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string, role: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    if (user.role !== role) {
      throw new Error(`Role mismatch: user is ${user.role}, but ${role} was requested`);
    }

    const token = this.generateToken(user);

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      token,
      name: user.name,
    };
  }

  /**
   * Create or update a user
   */
  async createOrUpdateUser(email: string, password: string, role: string, name: string = '') {
    const hashedPassword = await this.hashPassword(password);

    let user = await this.userModel.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.role = role;
      user.name = name;
      await user.save();
    } else {
      user = await this.userModel.create({
        email,
        password: hashedPassword,
        role,
        name,
      });
    }

    return user;
  }

  /**
   * Get all users (for debugging)
   */
  async getAllUsers() {
    return this.userModel.find().select('-password');
  }
}
