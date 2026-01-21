// Field type enum
export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  DROPDOWN = "dropdown",
}

// Dropdown option interface
export interface FieldOption {
  label: string;
  value: string;
}

// Field entity interface
export interface Field {
  id: string;
  formId: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: FieldOption[];
}

// Form entity interface
export interface Form {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  fieldOrder: string[];
  fields?: Field[];
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating/updating forms
export interface CreateFormDto {
  name: string;
  slug: string;
}

export interface UpdateFormDto {
  name?: string;
  slug?: string;
  fieldOrder?: string[];
}

// DTOs for creating/updating fields
export interface CreateFieldDto {
  type: FieldType;
  label: string;
  required: boolean;
  options?: FieldOption[];
}

export interface UpdateFieldDto {
  type?: FieldType;
  label?: string;
  required?: boolean;
  options?: FieldOption[];
}

// AI generation DTOs
export interface GenerateFormDto {
  description: string;
}

export interface GeneratedFormResponse {
  name: string;
  slug: string;
  fields: CreateFieldDto[];
}
