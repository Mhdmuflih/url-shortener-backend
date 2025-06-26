import { UserDocument } from "src/auth/model/users.schema";

export interface IUsersController {
    getUserData(userId: string): Promise<{ success: boolean; message: string; name: string }>
}