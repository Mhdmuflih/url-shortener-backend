import { Controller, Get, Headers, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/verifyJWT';
import { IUsersController } from 'src/interface/users/IUsersController';

@Controller('users')
export class UsersController implements IUsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('user-data')
  async getUserData(@Headers('x-user-id') userId: string): Promise<{ success: boolean; message: string; name: string }> {
    try {
      const userData = await this.usersService.getUserData(userId);
      return {success: true, message: "get the user name", name: userData.name}
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
