import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from 'src/interface/auth/IAuthService';
import { User, UserDocument } from './model/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyToken } from 'src/config/jwt';


@Injectable()
export class AuthService implements IAuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async createUser(createUser: CreateUserDto): Promise<User> {
    try {

      const existingUser = await this.userModel.findOne({ email: createUser.email });
      if (existingUser) {
        throw new ConflictException("User Already Existed.")
      }

      const hashedPassword = await bcrypt.hash(createUser.password, 10);
      const createdUser = new this.userModel({
        ...createUser,
        password: hashedPassword
      });
      return await createdUser.save();

    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async loginUser(formData: { email: string, password: string }): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const user = await this.userModel.findOne({ email: formData.email });
      if (!user) {
        throw new ConflictException("User is Not Found.")
      }

      const passwordMatch = await bcrypt.compare(formData.password, user.password);
      if (!passwordMatch) {
        throw new ConflictException("Password is Not Match.")
      }

      const accessToken: string = generateAccessToken(user._id.toString() as string);
      const refreshToken: string = generateRefreshToken(user._id.toString() as string);
      return { accessToken, refreshToken }

    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async validateRefreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      if (!token) {
        throw new ConflictException(" Refresh token not provided.")
      }

      const decode = await verifyToken(token);
      if (!decode || !decode.userId) {
        throw new UnauthorizedException("Invalid or expired refresh token.");
      }

      const userData = await this.userModel.findById(decode.userId);
      if (!userData) {
        throw new NotFoundException("User not found for the provided token.");
      }

      const accessToken: string = generateAccessToken(userData._id.toString() as string);
      const refreshToken: string = generateRefreshToken(userData._id.toString() as string);

      return { accessToken, refreshToken };
    } catch (error: any) {
      console.error("Error in validateRefreshToken:", error.message);
      throw new HttpException(
        error.message || 'An error occurred while validating the refresh token.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
