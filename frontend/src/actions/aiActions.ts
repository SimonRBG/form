import { api } from "../services/api";
import { GenerateFormDto, GeneratedFormResponse } from "../types";

/**
 * Actions for AI operations
 * Encapsulates all async operations related to AI form generation
 */

export const aiActions = {
  generateForm: async (data: GenerateFormDto): Promise<GeneratedFormResponse> => {
    try {
      const result = await api.ai.generateForm(data);
      return result;
    } catch (err) {
      console.error("Error generating form:", err);
      throw new Error("Failed to generate form. Please try again.");
    }
  },
};

