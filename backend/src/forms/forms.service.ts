import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Form } from "./entities/form.entity";
import { Field } from "../fields/entities/field.entity";
import { CreateFormDto } from "./dto/create-form.dto";
import { UpdateFormDto } from "./dto/update-form.dto";
import { SyncFormDto } from "./dto/sync-form.dto";

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(Field)
    private readonly fieldRepository: Repository<Field>,
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
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formRepository.findOne({
      where: { id },
      relations: ["fields"],
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

  async syncForm(id: string, syncFormDto: SyncFormDto): Promise<Form> {
    const form = await this.findOne(id);

    // Update form metadata
    if (syncFormDto.slug && syncFormDto.slug !== form.slug) {
      const existingForm = await this.formRepository.findOne({
        where: { slug: syncFormDto.slug },
      });
      if (existingForm && existingForm.id !== id) {
        throw new ConflictException(
          `Form with slug "${syncFormDto.slug}" already exists`,
        );
      }
    }

    form.name = syncFormDto.name;
    form.slug = syncFormDto.slug;

    // Get current field IDs
    const currentFieldIds = new Set(form.fields?.map((f) => f.id) || []);
    const newFieldIds = new Set(
      syncFormDto.fields
        .filter((f) => f.id && !f.id.startsWith("temp-"))
        .map((f) => f.id),
    );

    // Delete fields that are no longer present
    const fieldsToDelete = Array.from(currentFieldIds).filter(
      (id) => !newFieldIds.has(id),
    );
    if (fieldsToDelete.length > 0) {
      await this.fieldRepository.delete(fieldsToDelete);
    }

    const idMapping = new Map<string, string>();

    // Create or update fields
    const savedFields: Field[] = [];
    for (const fieldDto of syncFormDto.fields) {
      if (!fieldDto.id || fieldDto.id.startsWith("temp-")) {
        // Create new field
        const newField = this.fieldRepository.create({
          formId: form.id,
          type: fieldDto.type as any,
          label: fieldDto.label,
          required: fieldDto.required,
          options: fieldDto.options,
        });
        const saved = await this.fieldRepository.save(newField);
        savedFields.push(saved);
        if (fieldDto.id) {
          idMapping.set(fieldDto.id, saved.id);
        }
      } else {
        // Update existing field
        const existingField = await this.fieldRepository.findOne({
          where: { id: fieldDto.id },
        });
        if (existingField) {
          existingField.type = fieldDto.type as any;
          existingField.label = fieldDto.label;
          existingField.required = fieldDto.required;
          existingField.options = fieldDto.options;
          const saved = await this.fieldRepository.save(existingField);
          savedFields.push(saved);
        }
      }
    }

    // Update field order with real IDs
    form.fieldOrder = syncFormDto.fieldOrder.map(
      (id) => idMapping.get(id) || id,
    );

    await this.formRepository.update(id, {
      name: form.name,
      slug: form.slug,
      fieldOrder: form.fieldOrder,
    });

    // Return updated form with all fields
    return this.findOne(id);
  }
}
