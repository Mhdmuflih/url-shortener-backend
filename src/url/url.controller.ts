import { Body, Controller, Get, Headers, HttpException, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { IUrlController } from 'src/interface/url/IUrlController';
import { JwtAuthGuard } from 'src/guards/verifyJWT';
import { Response } from 'express';
import { URLDocument } from './model/url.schema';

@Controller('url')
export class UrlController implements IUrlController {
  constructor(private readonly urlService: UrlService) { }

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  async urlShortener(@Headers('x-user-id') userId: string, @Body('originalURL') longURL: string): Promise<{ success: boolean, message: string, shortURL: string }> {
    try {
      const urlShortener: URLDocument = await this.urlService.urlShortener(userId, longURL);
      return { success: true, message: "successfully received URL.", shortURL: urlShortener.shortURL }
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-urls')
  async getURLs(@Headers('x-user-id') userId: string): Promise<{ success: boolean, message: string, URLs: URLDocument[] }> {
    try {
      const urlData: URLDocument[] = await this.urlService.getURLs(userId);
      return { success: true, message: "successfully received URL.", URLs: urlData }
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response): Promise<void> {
    try {
      const found: URLDocument = await this.urlService.getOriginal(code);
      if (found) {
        return res.redirect(found.originalURL)
      }
      return res.redirect(`${process.env.FRONTEND}/${code}`);
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
