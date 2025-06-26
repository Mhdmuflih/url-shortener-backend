import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthController } from 'src/interface/auth/IAuthController';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async RegisterUser(@Body() formData: CreateUserDto): Promise<{ success: boolean, message: string }> {
    try {
      await this.authService.createUser(formData);
      return { success: true, message: "User Registration is successfully completed." }
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async LoginUser(@Body() formData: { email: string, password: string }): Promise<{ success: boolean, message: string, accessToken: string, refreshToken: string }> {
    try {
      const userData: { accessToken: string, refreshToken: string } = await this.authService.loginUser(formData);
      return { success: true, message: "User Login Successfully", accessToken: userData.accessToken, refreshToken: userData.refreshToken }
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('refresh-token')
  async ValidateRefreshToken(@Body("refreshToken") refreshToken: string): Promise<{ success: boolean, message: string, accessToken: string, refreshToken: string }> {
    try {
      const userData = await this.authService.validateRefreshToken(refreshToken);
      return { success: true, message: "Token created", accessToken: userData.accessToken, refreshToken: userData.refreshToken };
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
