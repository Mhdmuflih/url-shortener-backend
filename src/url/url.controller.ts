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

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response): Promise<void> {
    try {
      const found: URLDocument = await this.urlService.getOriginal(code);
      return res.redirect(found.originalURL)
    } catch (error: any) {
      console.log(error.message);
      throw new HttpException(error.message || 'An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
