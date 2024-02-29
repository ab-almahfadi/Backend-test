import { User } from './../users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as uniqueValidator from 'mongoose-unique-validator';
import mongoose from "mongoose";
import { Auth } from 'src/auth/entities/auth.entity';

export type MessageDocument = Message & Document;




@Schema({
    toJSON: {
        getters: true,
        virtuals: true,
    },
    timestamps: true,
})
export class Message extends mongoose.Document {
    @Prop({ required: true })
    message: string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // unique: true,
        ref: 'Auth',
      })
    auth_id: Auth | mongoose.Schema.Types.ObjectId;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    // auth_id: mongoose.Types.ObjectId;

    // @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    // userid: User._id;

}


export const MessageSchema = SchemaFactory.createForClass(Message)


MessageSchema.plugin(uniqueValidator);
