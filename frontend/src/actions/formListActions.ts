import { api } from "../services/api";
import { useFormListStore } from "../stores/formList";

/**
 * Actions for form list management
 * Encapsulates all async operations and API calls related to form lists
 */

export const formListActions = {
  loadForms: async (): Promise<void> => {
    const store = useFormListStore.getState();

    try {
      store.setLoading(true);
      const data = await api.forms.list();
      store.setForms(data);
    } catch (err) {
      console.error("Error loading forms:", err);
      store.setError("Failed to load forms");
      throw err;
    } finally {
      store.setLoading(false);
    }
  },

  deleteForm: async (formId: string): Promise<void> => {
    const store = useFormListStore.getState();

    try {
      await api.forms.delete(formId);
      store.deleteForm(formId);
    } catch (err) {
      console.error("Error deleting form:", err);
      store.setError("Failed to delete form");
      throw err;
    }
  },
};
