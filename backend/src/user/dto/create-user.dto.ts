import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    readonly username: string;
    @IsString()
    @IsNotEmpty()
    readonly firstname: string;
    @IsString()
    @IsNotEmpty()
    readonly lastname: string;
    @IsString()
    @IsNotEmpty()
    readonly wordpass: string;
  }