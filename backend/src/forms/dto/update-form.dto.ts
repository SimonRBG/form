import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateFormDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens only (e.g., my-form-name)',
  })
  slug?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  fieldOrder?: string[];
}

