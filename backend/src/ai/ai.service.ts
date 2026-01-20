import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FieldType } from '../fields/entities/field.entity';

export interface GeneratedField {
  type: FieldType;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface GeneratedForm {
  name: string;
  slug: string;
  fields: GeneratedField[];
}

@Injectable()
export class AiService {
  private readonly mistralApiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MISTRAL_API_KEY', '');
  }

  async generateForm(description: string): Promise<GeneratedForm> {
    if (!this.apiKey) {
      throw new HttpException(
        'Mistral API key is not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const systemPrompt = `You are a form builder assistant. Given a description of a form, you generate a structured form definition in JSON format.

The form structure must follow this exact schema:
{
  "name": "Form Name",
  "slug": "form-name",
  "fields": [
    {
      "type": "text" | "number" | "dropdown",
      "label": "Field Label",
      "required": true | false,
      "options": [{ "value": "option1", "label": "Option 1" }]  // Only for dropdown type
    }
  ]
}

Rules:
- "slug" must be lowercase with hyphens, no spaces or special characters
- "type" can only be "text", "number", or "dropdown"
- "options" is required only when type is "dropdown"
- Generate meaningful field labels based on the description
- Mark fields as required when they seem essential for the form's purpose
- Return ONLY valid JSON, no additional text or explanation`;

    const userPrompt = `Generate a form structure for the following description:\n\n${description}`;

    try {
      const response = await axios.post(
        this.mistralApiUrl,
        {
          model: 'mistral-small-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new HttpException(
          'No response from AI service',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const generatedForm = JSON.parse(content) as GeneratedForm;
      
      // Validate and sanitize the response
      return this.validateAndSanitizeForm(generatedForm);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const status = error.response?.status || HttpStatus.BAD_GATEWAY;
        const message =
          error.response?.data?.message || 'Failed to communicate with AI service';
        throw new HttpException(message, status);
      }

      throw new HttpException(
        'Failed to generate form',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateAndSanitizeForm(form: GeneratedForm): GeneratedForm {
    // Ensure name exists
    if (!form.name || typeof form.name !== 'string') {
      form.name = 'Generated Form';
    }

    // Generate slug if missing or invalid
    if (!form.slug || typeof form.slug !== 'string') {
      form.slug = this.generateSlug(form.name);
    } else {
      form.slug = this.generateSlug(form.slug);
    }

    // Validate fields
    if (!Array.isArray(form.fields)) {
      form.fields = [];
    }

    form.fields = form.fields
      .filter((field) => field && typeof field === 'object')
      .map((field) => this.sanitizeField(field));

    return form;
  }

  private sanitizeField(field: GeneratedField): GeneratedField {
    // Validate type
    const validTypes = [FieldType.TEXT, FieldType.NUMBER, FieldType.DROPDOWN];
    if (!validTypes.includes(field.type)) {
      field.type = FieldType.TEXT;
    }

    // Ensure label
    if (!field.label || typeof field.label !== 'string') {
      field.label = 'Untitled Field';
    }

    // Ensure required is boolean
    field.required = Boolean(field.required);

    // Handle options for dropdown
    if (field.type === FieldType.DROPDOWN) {
      if (!Array.isArray(field.options) || field.options.length === 0) {
        field.options = [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ];
      } else {
        field.options = field.options
          .filter((opt) => opt && typeof opt === 'object')
          .map((opt) => ({
            value: String(opt.value || 'option'),
            label: String(opt.label || opt.value || 'Option'),
          }));
      }
    } else {
      delete field.options;
    }

    return field;
  }

  private generateSlug(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 255);
  }
}

