import * as jwt from 'jsonwebtoken';
import {configDotenv} from 'dotenv';

configDotenv();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export const generateAccessToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        JWT_ACCESS_SECRET,
        { expiresIn: '30m' }
    );
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        JWT_REFRESH_SECRET,
        { expiresIn: '1d' }
    );
};

export const verifyToken = (token: string) => {
    try {
        const decode = jwt.verify(token, JWT_REFRESH_SECRET as string ) as jwt.JwtPayload;
        console.log(decode , "decode in url");
        return decode;
    } catch (error: any) {
        console.log(error.message, 'this error occur in verify token');
    }
}