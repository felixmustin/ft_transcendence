import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserProfileDto {
    @IsString()
    @IsNotEmpty()
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    readonly firstname: string;
    @IsString()
    @IsNotEmpty()
    readonly lastname: string;
    @IsString()
    @IsNotEmpty()
    readonly age: number;
  }