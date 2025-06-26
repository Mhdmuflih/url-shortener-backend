import { CreateUserDto } from "src/auth/dto/create-user.dto";

export interface IAuthController {
    RegisterUser(formData: CreateUserDto): Promise<{ success: boolean, message: string }>
    LoginUser(formData: { email: string, password: string }): Promise<{ success: boolean, message: string, accessToken: string, refreshToken: string }>
    ValidateRefreshToken(refreshToken: string): Promise<{ success: boolean, message: string, accessToken?: string, refreshToken?: string }>
}