import { create } from "zustand";
import { Form, Field } from "../types";

// State interface
interface FormState {
  form: Form | null;
  initialForm: Form | null; // Store the initial form state
}

// Action types
type FormAction =
  | { type: "SET_FORM"; payload: Form }
  | { type: "UPDATE_METADATA"; payload: { name: string; slug: string } }
  | { type: "ADD_FIELD"; payload: Field }
  | {
      type: "UPDATE_FIELD";
      payload: { fieldId: string; fieldData: Partial<Field> };
    }
  | { type: "DELETE_FIELD"; payload: string }
  | { type: "REORDER_FIELDS"; payload: string[] }
  | { type: "RESET_CHANGES" }
  | { type: "CLEAR_FORM" };

// Reducer function
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FORM":
      return {
        form: action.payload,
        initialForm: action.payload
          ? JSON.parse(JSON.stringify(action.payload))
          : null, // Deep clone
      };

    case "UPDATE_METADATA":
      return {
        ...state,
        form: state.form
          ? {
              ...state.form,
              name: action.payload.name,
              slug: action.payload.slug,
            }
          : null,
      };

    case "ADD_FIELD":
      return {
        ...state,
        form: state.form
          ? {
              ...state.form,
              fields: [...(state.form.fields || []), action.payload],
              fieldOrder: [...state.form.fieldOrder, action.payload.id],
            }
          : null,
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        form: state.form
          ? {
              ...state.form,
              fields: state.form.fields?.map((f) =>
                f.id === action.payload.fieldId
                  ? { ...f, ...action.payload.fieldData }
                  : f,
              ),
            }
          : null,
      };

    case "DELETE_FIELD":
      return {
        ...state,
        form: state.form
          ? {
              ...state.form,
              fields: state.form.fields?.filter((f) => f.id !== action.payload),
              fieldOrder: state.form.fieldOrder.filter(
                (id) => id !== action.payload,
              ),
            }
          : null,
      };

    case "REORDER_FIELDS":
      return {
        ...state,
        form: state.form ? { ...state.form, fieldOrder: action.payload } : null,
      };

    case "RESET_CHANGES":
      return {
        ...state,
        form: state.initialForm
          ? JSON.parse(JSON.stringify(state.initialForm))
          : null, // Reset to initial state
      };

    case "CLEAR_FORM":
      return {
        form: null,
        initialForm: null,
      };

    default:
      return state;
  }
};

// Store interface
interface FormStore extends FormState {
  dispatch: (action: FormAction) => void;
  setForm: (form: Form) => void;
  updateMetadata: (name: string, slug: string) => void;
  addField: (field: Field) => void;
  updateField: (fieldId: string, fieldData: Partial<Field>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (newOrder: string[]) => void;
  resetChanges: () => void;
  clearForm: () => void;
}

// Create store with reducer
export const useFormStore = create<FormStore>((set) => ({
  // Initial state
  form: null,
  initialForm: null,

  // Dispatch function
  dispatch: (action: FormAction) => set((state) => formReducer(state, action)),

  // Action creators (convenience methods)
  setForm: (form: Form) =>
    set((state) => formReducer(state, { type: "SET_FORM", payload: form })),

  updateMetadata: (name: string, slug: string) =>
    set((state) =>
      formReducer(state, { type: "UPDATE_METADATA", payload: { name, slug } }),
    ),

  addField: (field: Field) =>
    set((state) => formReducer(state, { type: "ADD_FIELD", payload: field })),

  updateField: (fieldId: string, fieldData: Partial<Field>) =>
    set((state) =>
      formReducer(state, {
        type: "UPDATE_FIELD",
        payload: { fieldId, fieldData },
      }),
    ),

  deleteField: (fieldId: string) =>
    set((state) =>
      formReducer(state, { type: "DELETE_FIELD", payload: fieldId }),
    ),

  reorderFields: (newOrder: string[]) =>
    set((state) =>
      formReducer(state, { type: "REORDER_FIELDS", payload: newOrder }),
    ),

  resetChanges: () =>
    set((state) => formReducer(state, { type: "RESET_CHANGES" })),

  clearForm: () => set((state) => formReducer(state, { type: "CLEAR_FORM" })),
}));
