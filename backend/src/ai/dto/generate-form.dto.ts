import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class GenerateFormDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'Description must be at least 10 characters long',
  })
  @MaxLength(2000, {
    message: 'Description must not exceed 2000 characters',
  })
  description: string;
}

