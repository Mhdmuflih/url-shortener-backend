import { Response } from "express";
import { URLDocument } from "src/url/model/url.schema";

export interface IUrlController {
    urlShortener(userId: string, longURL: string): Promise<{ success: boolean, message: string, shortURL: string }>
    redirect(code: string, res: Response): Promise<void>
}