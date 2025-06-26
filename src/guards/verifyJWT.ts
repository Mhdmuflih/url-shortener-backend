import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Unauthorized");
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access_secret") as jwt.JwtPayload;
            console.log(decoded, 'this is decoded user id');
            request.headers['x-user-id'] = decoded.userId; // Attach user ID
            return true;
        } catch (error: any) {
            console.error("API Error:", error.response?.status, error.response?.data);
            console.log("Error verifying token:", error.message);
            throw new ForbiddenException("Invalid or expired token");
        }
    }
}
