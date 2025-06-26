import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type URLDocument = URL & Document;

@Schema({timestamps: true})
export class URL {
    @Prop({type: String, required: true})
    originalURL: string;

    @Prop({type: String, required: true})
    shortURL: string;

    @Prop({type: Types.ObjectId, ref: "User"})
    userId: Types.ObjectId;
}

export const URLSchema = SchemaFactory.createForClass(URL);