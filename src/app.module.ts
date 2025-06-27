import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoURL'),
        dbName: 'urlShortener',
      }),
    }),
    AuthModule,
    UsersModule,
    UrlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
