import { useState, useEffect } from "react";
import { Field, FieldType, CreateFieldDto, FieldOption } from "../types";
import { Button } from "@/components/ui/button";
import { CiTrash } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";
import AlertDialog from "@/components/AlertDialog";

interface FieldEditorProps {
  field: Field | null;
  onSave: (fieldData: CreateFieldDto) => void;
  onCancel: () => void;
}

export default function FieldEditor({
  field,
  onSave,
  onCancel,
}: FieldEditorProps) {
  const [fieldType, setFieldType] = useState<FieldType>(
    field?.type || FieldType.TEXT,
  );
  const [label, setLabel] = useState(field?.label || "");
  const [required, setRequired] = useState(field?.required || false);
  const [options, setOptions] = useState<FieldOption[]>(field?.options || []);
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (field) {
      setFieldType(field.type);
      setLabel(field.label);
      setRequired(field.required);
      setOptions(field.options || []);
    }
  }, [field]);

  const handleAddOption = () => {
    if (newOptionLabel.trim() && newOptionValue.trim()) {
      setOptions([
        ...options,
        { label: newOptionLabel.trim(), value: newOptionValue.trim() },
      ]);
      setNewOptionLabel("");
      setNewOptionValue("");
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!label.trim()) {
      setAlertMessage("Label is required");
      setShowAlert(true);
      return;
    }

    if (fieldType === FieldType.DROPDOWN && options.length === 0) {
      setAlertMessage("At least one option is required for dropdown fields");
      setShowAlert(true);
      return;
    }

    const fieldData: CreateFieldDto = {
      type: fieldType,
      label: label.trim(),
      required,
    };

    if (fieldType === FieldType.DROPDOWN) {
      fieldData.options = options;
    }

    onSave(fieldData);
  };

  return (
    <div className="field-editor">
      <h3>{field ? "Edit Field" : "Add Field"}</h3>

      <div className="form-group">
        <label htmlFor="field-type">Field Type *</label>
        <select
          id="field-type"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value as FieldType)}
          className="form-control"
        >
          <option value={FieldType.TEXT}>Text</option>
          <option value={FieldType.NUMBER}>Number</option>
          <option value={FieldType.DROPDOWN}>Dropdown</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="field-label">Label *</label>
        <input
          id="field-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter field label"
          className="form-control"
        />
      </div>

      <div className="form-group flex items-start gap-2 h-24">
        <Checkbox
          className="h-4 w-4"
          id="required"
          checked={required}
          onCheckedChange={(checked) =>
            setRequired(checked === "indeterminate" ? false : checked)
          }
        />
        <label className="text-sm text-4 h-4" htmlFor="required">
          Required field
        </label>
      </div>

      {fieldType === FieldType.DROPDOWN && (
        <div className="form-group">
          <label>Options *</label>
          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-item">
                <span className="option-label">{option.label}</span>
                <code className="option-value">{option.value}</code>
                <Button
                  onClick={() => handleRemoveOption(index)}
                  className="btn btn-sm btn-danger"
                >
                  <CiTrash />
                </Button>
              </div>
            ))}
          </div>

          <div className="add-option-form">
            <input
              type="text"
              value={newOptionLabel}
              onChange={(e) => setNewOptionLabel(e.target.value)}
              placeholder="Option label"
              className="form-control"
            />
            <input
              type="text"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              placeholder="Option value"
              className="form-control"
            />
            <Button
              onClick={handleAddOption}
              disabled={!newOptionLabel.trim() || !newOptionValue.trim()}
              className="btn btn-secondary"
            >
              <IoMdAdd />
            </Button>
          </div>
        </div>
      )}

      <div className="modal-actions">
        <Button onClick={onCancel} className="btn btn-secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} className="btn btn-primary">
          {field ? "Update Field" : "Add Field"}
        </Button>
      </div>

      {showAlert && (
        <AlertDialog
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
