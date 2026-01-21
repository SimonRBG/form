import { IsString, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SyncFieldDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;

  @IsString()
  label: string;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  options?: any;
}

export class SyncFormDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncFieldDto)
  fields: SyncFieldDto[];

  @IsArray()
  @IsString({ each: true })
  fieldOrder: string[];
}

