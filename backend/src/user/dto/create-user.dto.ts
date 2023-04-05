import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly loginName: string;
    @IsString()
    @IsNotEmpty()
    readonly wordpass: string;

  }