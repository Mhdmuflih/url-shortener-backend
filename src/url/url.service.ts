import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUrlService } from 'src/interface/url/IUrlService';
import { URL, URLDocument } from './model/url.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService implements IUrlService {
  constructor(@InjectModel(URL.name) private readonly urlModel: Model<URLDocument>) { }

  async urlShortener(userId: string, longURL: string): Promise<URLDocument> {
    try {
      const urlData = await this.urlModel.findOne({ originalURL: longURL, userId: userId });
      if (urlData) {
        return urlData;
      }

      const shortCode = `${process.env.BACKENDURL}/url/${nanoid(6)}`;
      const createURLShotener = new this.urlModel({
        originalURL: longURL,
        shortURL: shortCode,
        userId: userId
      });

      return createURLShotener.save();
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOriginal(code: string): Promise<URLDocument> {
    try {
      const data = await this.urlModel.findOne({ shortURL: `${process.env.BACKENDURL}/url/${code}` });
      if (!data) {
        return;
      }
      return data;
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getURLs(userId: string): Promise<URLDocument[]> {
  try {
    if (!userId) {
      throw new ConflictException("User ID is required but was not provided.");
    }

    const data: URLDocument[] = await this.urlModel.find({ userId });
    if (!data || data.length === 0) {
      throw new NotFoundException("No shortened URLs found for this user.");
    }
    return data;
  } catch (error: any) {
    console.error("Error in getURLs:", error.message);
    throw new HttpException(error.message || 'An unexpected error occurred while fetching URLs.',error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

}
