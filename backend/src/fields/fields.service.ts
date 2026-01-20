import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field, FieldType } from './entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FormsService } from '../forms/forms.service';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
    @Inject(forwardRef(() => FormsService))
    private readonly formsService: FormsService,
  ) {}

  private validateDropdownOptions(options: any[] | null | undefined): void {
    if (!options || options.length === 0) {
      throw new BadRequestException(
        'Dropdown fields must have at least one option',
      );
    }

    // Check for unique values
    const values = options.map((opt) => opt.value);
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
      throw new BadRequestException(
        'Dropdown options must have unique values',
      );
    }
  }

  async create(formId: string, createFieldDto: CreateFieldDto): Promise<Field> {
    // Verify form exists
    const form = await this.formsService.findOne(formId);

    // Additional validation for dropdown fields
    if (createFieldDto.type === FieldType.DROPDOWN) {
      this.validateDropdownOptions(createFieldDto.options);
    }

    const field = this.fieldRepository.create({
      ...createFieldDto,
      formId,
    });

    const savedField = await this.fieldRepository.save(field);

    // Add field ID to the end of fieldOrder
    form.fieldOrder.push(savedField.id);
    await this.formsService.updateFieldOrder(formId, form.fieldOrder);

    return savedField;
  }

  async findAllByForm(formId: string): Promise<Field[]> {
    // This will throw if form doesn't exist
    const form = await this.formsService.findOne(formId);
    return form.fields;
  }

  async findOne(formId: string, fieldId: string): Promise<Field> {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId, formId },
    });

    if (!field) {
      throw new NotFoundException(
        `Field with ID "${fieldId}" not found in form "${formId}"`,
      );
    }

    return field;
  }

  async update(
    formId: string,
    fieldId: string,
    updateFieldDto: UpdateFieldDto,
  ): Promise<Field> {
    const field = await this.findOne(formId, fieldId);

    // Determine the final type after update
    const finalType = updateFieldDto.type ?? field.type;

    // Validate dropdown fields have valid options
    if (finalType === FieldType.DROPDOWN) {
      const finalOptions = updateFieldDto.options !== undefined 
        ? updateFieldDto.options 
        : field.options;
      
      this.validateDropdownOptions(finalOptions);
    }

    Object.assign(field, updateFieldDto);
    return this.fieldRepository.save(field);
  }

  async remove(formId: string, fieldId: string): Promise<void> {
    const field = await this.findOne(formId, fieldId);
    const form = await this.formsService.findOne(formId);

    await this.fieldRepository.remove(field);

    // Remove field ID from fieldOrder
    form.fieldOrder = form.fieldOrder.filter((id) => id !== fieldId);
    await this.formsService.updateFieldOrder(formId, form.fieldOrder);
  }

  async createMany(formId: string, fields: CreateFieldDto[]): Promise<Field[]> {
    const createdFields: Field[] = [];
    for (const fieldDto of fields) {
      const field = await this.create(formId, fieldDto);
      createdFields.push(field);
    }
    return createdFields;
  }
}

