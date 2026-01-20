import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<Form> {
    const existingForm = await this.formRepository.findOne({
      where: { slug: createFormDto.slug },
    });

    if (existingForm) {
      throw new ConflictException(
        `Form with slug "${createFormDto.slug}" already exists`,
      );
    }

    const form = this.formRepository.create(createFormDto);
    return this.formRepository.save(form);
  }

  async findAll(): Promise<Form[]> {
    return this.formRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ['fields'],
    });

    if (!form) {
      throw new NotFoundException(`Form with ID "${id}" not found`);
    }

    // Sort fields according to fieldOrder
    if (form.fields && form.fieldOrder && form.fieldOrder.length > 0) {
      const orderMap = new Map(
        form.fieldOrder.map((fieldId, index) => [fieldId, index]),
      );
      form.fields.sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const orderB = orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
    }

    return form;
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.findOne(id);

    if (updateFormDto.slug && updateFormDto.slug !== form.slug) {
      const existingForm = await this.formRepository.findOne({
        where: { slug: updateFormDto.slug },
      });

      if (existingForm) {
        throw new ConflictException(
          `Form with slug "${updateFormDto.slug}" already exists`,
        );
      }
    }

    Object.assign(form, updateFormDto);
    return this.formRepository.save(form);
  }

  async publish(id: string): Promise<Form> {
    const form = await this.findOne(id);
    form.published = true;
    return this.formRepository.save(form);
  }

  async unpublish(id: string): Promise<Form> {
    const form = await this.findOne(id);
    form.published = false;
    return this.formRepository.save(form);
  }

  async remove(id: string): Promise<void> {
    const form = await this.findOne(id);
    await this.formRepository.remove(form);
  }

  async updateFieldOrder(formId: string, fieldOrder: string[]): Promise<void> {
    const form = await this.findOne(formId);
    form.fieldOrder = fieldOrder;
    await this.formRepository.save(form);
  }
}

