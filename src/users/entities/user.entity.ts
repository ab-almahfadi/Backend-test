import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Auth } from 'src/auth/entities/auth.entity';


export type UserDocument = User & Document;


export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

@Schema()
export class User extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  // @Prop({ required: true, select: false })
  // password: string;

  // @Prop({ unique: true, required: true })
  // email: string;

  @Prop({ type: String, enum: Object.values(Gender) })
  gender: Gender;

  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ type: String, required: true })
  horoscope: string;

  @Prop({ type: String, required: true })
  zodiac: string;

  @Prop({ type: Number, required: true })
  weight: number;

  @Prop({ type: Number, required: true })
  height: number;

  @Prop({ type: String, required: false })
  image_profile: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'Auth',
  })
  auth_id: Auth | mongoose.Schema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(uniqueValidator);
