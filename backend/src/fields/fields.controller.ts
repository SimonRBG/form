import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';

@Controller('forms/:formId/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Body() createFieldDto: CreateFieldDto,
  ) {
    return this.fieldsService.create(formId, createFieldDto);
  }

  @Get()
  findAll(@Param('formId', ParseUUIDPipe) formId: string) {
    return this.fieldsService.findAllByForm(formId);
  }

  @Get(':fieldId')
  findOne(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Param('fieldId', ParseUUIDPipe) fieldId: string,
  ) {
    return this.fieldsService.findOne(formId, fieldId);
  }

  @Patch(':fieldId')
  update(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Param('fieldId', ParseUUIDPipe) fieldId: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(formId, fieldId, updateFieldDto);
  }

  @Delete(':fieldId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Param('fieldId', ParseUUIDPipe) fieldId: string,
  ) {
    return this.fieldsService.remove(formId, fieldId);
  }
}

