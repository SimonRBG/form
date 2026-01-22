import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Form } from "../../forms/entities/form.entity";

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  DROPDOWN = "dropdown",
}

export interface DropdownOption {
  value: string;
  label: string;
}

@Entity("fields")
export class Field {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  formId: string;

  @Column({
    type: "enum",
    enum: FieldType,
    default: FieldType.TEXT,
  })
  type: FieldType;

  @Column({ type: "varchar", length: 255 })
  label: string;

  @Column({ type: "boolean", default: false })
  required: boolean;

  @Column({ type: "jsonb", nullable: true })
  options: DropdownOption[] | null;

  @ManyToOne(() => Form, (form) => form.fields, { onDelete: "CASCADE" })
  @JoinColumn({ name: "formId" })
  form: Form;
}
