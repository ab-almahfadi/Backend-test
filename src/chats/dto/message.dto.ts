import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsMongoId  } from "class-validator";
import { Auth } from 'src/auth/entities/auth.entity';

export class MessageDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    // @ApiProperty()
    auth_id: string;

    // @ApiProperty()
    // @IsMongoId()
    // @IsNotEmpty()
    // userId: string; // Assuming the user ID is stored as a MongoDB ObjectId
}