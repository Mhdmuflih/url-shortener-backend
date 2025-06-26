import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/model/users.schema';
import { IUsersService } from 'src/interface/users/IUsersService';

@Injectable()
export class UsersService implements IUsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async getUserData(userId: string): Promise<UserDocument> {
    try {
      const userData = await this.userModel.findOne({_id: userId});
      if(!userData) {
        throw new ConflictException("User is not found.");
      }
      return userData;
    } catch (error: any) {
            console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
