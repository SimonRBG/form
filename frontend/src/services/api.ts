import axios, { AxiosInstance } from 'axios';
import {
  Form,
  Field,
  CreateFormDto,
  UpdateFormDto,
  CreateFieldDto,
  UpdateFieldDto,
  GenerateFormDto,
  GeneratedFormResponse,
} from '../types';

// Configure base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Forms API
const formsApi = {
  /**
   * Get all forms
   */
  list: async (): Promise<Form[]> => {
    const response = await axiosInstance.get<Form[]>('/forms');
    return response.data;
  },

  /**
   * Get a single form by ID
   */
  get: async (id: string): Promise<Form> => {
    const response = await axiosInstance.get<Form>(`/forms/${id}`);
    return response.data;
  },

  /**
   * Create a new form
   */
  create: async (data: CreateFormDto): Promise<Form> => {
    const response = await axiosInstance.post<Form>('/forms', data);
    return response.data;
  },

  /**
   * Update an existing form
   */
  update: async (id: string, data: UpdateFormDto): Promise<Form> => {
    const response = await axiosInstance.patch<Form>(`/forms/${id}`, data);
    return response.data;
  },

  /**
   * Publish a form
   */
  publish: async (id: string): Promise<Form> => {
    const response = await axiosInstance.post<Form>(`/forms/${id}/publish`);
    return response.data;
  },

  /**
   * Delete a form
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/forms/${id}`);
  },
};

// Fields API
const fieldsApi = {
  /**
   * Create a new field for a form
   */
  create: async (formId: string, data: CreateFieldDto): Promise<Field> => {
    const response = await axiosInstance.post<Field>(
      `/forms/${formId}/fields`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing field
   */
  update: async (
    formId: string,
    fieldId: string,
    data: UpdateFieldDto
  ): Promise<Field> => {
    const response = await axiosInstance.patch<Field>(
      `/forms/${formId}/fields/${fieldId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a field
   */
  delete: async (formId: string, fieldId: string): Promise<void> => {
    await axiosInstance.delete(`/forms/${formId}/fields/${fieldId}`);
  },
};

// AI API
const aiApi = {
  /**
   * Generate form structure from natural language description
   */
  generateForm: async (data: GenerateFormDto): Promise<GeneratedFormResponse> => {
    const response = await axiosInstance.post<GeneratedFormResponse>(
      '/ai/generate-form',
      data
    );
    return response.data;
  },
};

// Export unified API object
export const api = {
  forms: formsApi,
  fields: fieldsApi,
  ai: aiApi,
};

// Export axios instance for custom usage if needed
export { axiosInstance };

