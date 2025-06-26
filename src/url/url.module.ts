import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { URLSchema } from './model/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: URL.name, schema: URLSchema }])
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule { }
