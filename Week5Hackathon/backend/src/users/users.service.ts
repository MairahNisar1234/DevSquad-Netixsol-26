import { Injectable, BadRequestException, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Registers a new user with a hashed password.
   * Returns the user data without sensitive fields.
   */
  async register(userData: any): Promise<any> { // Changed to Promise<any> to allow plain object return
    const { email, password, name } = userData;

    this.logger.log(`Incoming registration request for: ${email}`);

    try {
      // 1. Check for duplicate email
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        this.logger.warn(`Registration blocked: ${email} is already in use.`);
        throw new ConflictException('User with this email already exists');
      }

      // 2. Securely hash the password
      this.logger.debug('Generating secure hash for password...');
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Save to database
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      this.logger.log(`Successfully registered User ID: ${savedUser._id}`);

      // 4. Strip sensitive & internal data before returning
      // We alias password to '_' and ignore it, and remove the Mongoose version key '__v'
      const { password: _, __v, ...result } = savedUser.toObject(); 
      
      return result;

    } catch (error: any) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches a user profile by ID while excluding the password hash.
   */
 async findById(id: string): Promise<any> {
    // Check if ID exists to prevent "Cast to ObjectId failed" errors
    if (!id) {
      this.logger.error("findById called with undefined or null ID");
      throw new BadRequestException('Invalid User ID');
    }

    this.logger.log(`Querying database for User ID: ${id}`);
    
    const user = await this.userModel.findById(id).select('-password').lean().exec();
    
    if (!user) {
      this.logger.error(`Database Query Failed: User ID ${id} does not exist.`);
      throw new BadRequestException('User not found');
    }

    return user;
  }
async findByEmail(email: string): Promise<User | null> {
  this.logger.log(`Searching for user with email: ${email}`);
  
  // We do NOT use .select('-password') here because the AuthService 
  // NEEDS the password hash to compare it with bcrypt.
  return this.userModel.findOne({ email }).exec();
}
// Add this method inside your UserService class
async updateUser(id: string, data: any): Promise<any> {
  this.logger.log(`Updating profile for User ID: ${id}`);
  
  // Use $set to update only the fields provided in the body
  const updatedUser = await this.userModel
    .findByIdAndUpdate(id, { $set: data }, { new: true })
    .select('-password') // Ensure password isn't returned
    .lean()
    .exec();

  if (!updatedUser) {
    this.logger.error(`Update Failed: User ID ${id} not found.`);
    throw new BadRequestException('User not found');
  }

  this.logger.log(`Successfully updated profile for User ID: ${id}`);
  return updatedUser;
}
}
