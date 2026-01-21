import { create } from "zustand";
import { Form } from "../types";

// State interface
interface FormListState {
  forms: Form[];
  loading: boolean;
  error: string | null;
}

// Action types
type FormListAction =
  | { type: "SET_FORMS"; payload: Form[] }
  | { type: "ADD_FORM"; payload: Form }
  | { type: "UPDATE_FORM"; payload: Form }
  | { type: "DELETE_FORM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

// Reducer function
const formListReducer = (
  state: FormListState,
  action: FormListAction,
): FormListState => {
  switch (action.type) {
    case "SET_FORMS":
      return {
        ...state,
        forms: action.payload,
        loading: false,
        error: null,
      };

    case "ADD_FORM":
      return {
        ...state,
        forms: [action.payload, ...state.forms],
        error: null,
      };

    case "UPDATE_FORM":
      return {
        ...state,
        forms: state.forms.map((f) =>
          f.id === action.payload.id ? action.payload : f,
        ),
        error: null,
      };

    case "DELETE_FORM":
      return {
        ...state,
        forms: state.forms.filter((f) => f.id !== action.payload),
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Store interface
interface FormListStore extends FormListState {
  dispatch: (action: FormListAction) => void;
  setForms: (forms: Form[]) => void;
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (formId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Create store with reducer
export const useFormListStore = create<FormListStore>((set) => ({
  // Initial state
  forms: [],
  loading: false,
  error: null,

  // Dispatch function
  dispatch: (action: FormListAction) =>
    set((state) => formListReducer(state, action)),

  // Action creators (convenience methods)
  setForms: (forms: Form[]) =>
    set((state) =>
      formListReducer(state, { type: "SET_FORMS", payload: forms }),
    ),

  addForm: (form: Form) =>
    set((state) => formListReducer(state, { type: "ADD_FORM", payload: form })),

  updateForm: (form: Form) =>
    set((state) =>
      formListReducer(state, { type: "UPDATE_FORM", payload: form }),
    ),

  deleteForm: (formId: string) =>
    set((state) =>
      formListReducer(state, { type: "DELETE_FORM", payload: formId }),
    ),

  setLoading: (loading: boolean) =>
    set((state) =>
      formListReducer(state, { type: "SET_LOADING", payload: loading }),
    ),

  setError: (error: string | null) =>
    set((state) =>
      formListReducer(state, { type: "SET_ERROR", payload: error }),
    ),

  clearError: () =>
    set((state) => formListReducer(state, { type: "CLEAR_ERROR" })),
}));
