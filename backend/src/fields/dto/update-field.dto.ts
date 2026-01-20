import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
  IsNotEmpty,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldType } from '../entities/field.entity';
import { IsUniqueOptions } from '../validators/unique-options.validator';

class DropdownOptionDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  label: string;
}

export class UpdateFieldDto {
  @IsEnum(FieldType)
  @IsOptional()
  type?: FieldType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  label?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ValidateIf((o) => o.type === FieldType.DROPDOWN || o.options !== undefined)
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Dropdown fields must have at least one option',
  })
  @ValidateNested({ each: true })
  @Type(() => DropdownOptionDto)
  @IsUniqueOptions()
  @IsOptional()
  options?: DropdownOptionDto[];
}

