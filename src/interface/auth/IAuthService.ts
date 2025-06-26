import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { User } from "src/auth/model/users.schema";

export interface IAuthService {
    createUser(createUser: CreateUserDto): Promise<User>
    loginUser(formData: { email: string, password: string }): Promise<{ accessToken: string, refreshToken: string }>
    validateRefreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }>
}