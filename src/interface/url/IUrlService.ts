import { URLDocument } from "src/url/model/url.schema";

export interface IUrlService {
    urlShortener(userId: string, longURL: string): Promise<URLDocument>
    getOriginal(code: string): Promise<URLDocument>
}