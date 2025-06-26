import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @Matches(/^\d{10}$/, { message: 'Mobile number must be 10 digits' })
    readonly mobile: string;

    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    password: string;
}