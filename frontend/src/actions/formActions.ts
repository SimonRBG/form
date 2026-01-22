import { api } from "../services/api";
import { useFormStore } from "../stores/form";
import { Form, CreateFormDto } from "../types";

export const formActions = {
  loadForm: async (formId: string): Promise<void> => {
    const store = useFormStore.getState();

    try {
      const data = await api.forms.get(formId);
      store.setForm(data);
    } catch (err) {
      console.error("Error loading form:", err);
      throw new Error("Failed to load form");
    }
  },

  createForm: async (data: CreateFormDto): Promise<Form> => {
    const store = useFormStore.getState();

    try {
      const newForm = await api.forms.create(data);
      store.setForm(newForm);
      return newForm;
    } catch (err) {
      console.error("Error creating form:", err);
      throw new Error("Failed to create form");
    }
  },

  saveForm: async (formId: string, form: Form): Promise<Form> => {
    const store = useFormStore.getState();

    try {
      const updatedForm = await api.forms.sync(formId, form);
      store.setForm(updatedForm);
      return updatedForm;
    } catch (err) {
      console.error("Error saving form:", err);
      throw new Error("Failed to save changes");
    }
  },

  publishForm: async (formId: string): Promise<Form> => {
    const store = useFormStore.getState();

    try {
      const updatedForm = await api.forms.publish(formId);
      store.setForm(updatedForm);
      return updatedForm;
    } catch (err) {
      console.error("Error publishing form:", err);
      throw new Error("Failed to publish form");
    }
  },
};
