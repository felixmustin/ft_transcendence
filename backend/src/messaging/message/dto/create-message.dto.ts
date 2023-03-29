import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  targetId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
