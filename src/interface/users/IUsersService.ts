import { UserDocument } from "src/auth/model/users.schema";

export interface IUsersService {
    getUserData(userId: string): Promise<UserDocument>
}