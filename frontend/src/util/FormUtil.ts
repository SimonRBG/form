import { Field, Form } from "@/types";

// Helper function to normalize field for comparison (ignore ID)
const normalizeField = (field: Field): string => {
    return JSON.stringify({
      type: field.type,
      label: field.label,
      required: field.required,
      options: field.options || [],
    });
  };

// Helper function to deep compare forms
export const areFormsEqual = (form1: Form | null, form2: Form | null): boolean => {
    if (!form1 || !form2) return form1 === form2;
    if (form1.id !== form2.id) return false;
    if (form1.name !== form2.name) return false;
    if (form1.slug !== form2.slug) return false;
  
    const fields1 = form1.fields || [];
    const fields2 = form2.fields || [];
  
    // Compare field count
    if (fields1.length !== fields2.length) return false;
  
    // Compare fields by content (ignore IDs) - sorted to handle any order
    const normalizedFields1 = fields1.map(normalizeField).sort();
    const normalizedFields2 = fields2.map(normalizeField).sort();
  
    if (
      !normalizedFields1.every(
        (field, index) => field === normalizedFields2[index],
      )
    ) {
      return false;
    }
  
    // Compare fieldOrder by comparing normalized fields at each position
    if (form1.fieldOrder.length !== form2.fieldOrder.length) return false;
  
    for (let i = 0; i < form1.fieldOrder.length; i++) {
      const field1 = fields1.find((f) => f.id === form1.fieldOrder[i]);
      const field2 = fields2.find((f) => f.id === form2.fieldOrder[i]);
  
      if (!field1 || !field2) return false;
      if (normalizeField(field1) !== normalizeField(field2)) return false;
    }
  
    return true;
  };