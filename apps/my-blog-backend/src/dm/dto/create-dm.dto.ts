import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDmDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
