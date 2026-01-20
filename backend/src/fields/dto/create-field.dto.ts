import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
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

export class CreateFieldDto {
  @IsEnum(FieldType)
  type: FieldType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  label: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean = false;

  @ValidateIf((o) => o.type === FieldType.DROPDOWN)
  @IsArray()
  @ArrayMinSize(1, {
    message: 'Dropdown fields must have at least one option',
  })
  @ValidateNested({ each: true })
  @Type(() => DropdownOptionDto)
  @IsUniqueOptions()
  options?: DropdownOptionDto[];
}

