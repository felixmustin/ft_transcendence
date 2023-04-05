import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {

  @IsNumber()
  targetId: number;

  @IsNumber()
  chatRoomId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
