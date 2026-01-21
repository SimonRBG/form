import { useState } from "react";
import { CreateFieldDto, GeneratedFormResponse } from "../types";
import { aiActions } from "../actions/aiActions";
import { Button } from "@/components/ui/button";
import { getFieldTypeIcon } from "@/util/FieldUtil";

interface AIGeneratorProps {
  onGenerate: (fields: CreateFieldDto[]) => void;
  onCancel: () => void;
}

export default function AIGenerator({
  onGenerate,
  onCancel,
}: AIGeneratorProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GeneratedFormResponse | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await aiActions.generateForm({
        description: description.trim(),
      });
      setPreview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (preview?.fields) {
      onGenerate(preview.fields);
    }
  };

  return (
    <div className="ai-generator">
      <h3>AI Form Generator</h3>
      <p className="help-text">
        Describe the form you want to create in natural language, and <strong>AI will generate and append</strong>  the fields for you.
      </p>

      <div className="form-group">
        <label htmlFor="ai-description">Form Description</label>
        <textarea
          id="ai-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: Create a contact form with name, email, phone number, and a dropdown for inquiry type (Sales, Support, General)"
          rows={6}
          disabled={loading}
          className="form-control"
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!preview && (
        <div className="modal-actions">
          <Button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="btn btn-ai"
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      )}

      {preview && (
        <>
          <div className="preview-section">
            <h4>Preview Generated Fields</h4>
            <div className="field-preview-list">
              {preview.fields.map((field, index) => (
                <div key={index} className="field-preview-item">
                  <div className="field-icon">
                    {getFieldTypeIcon(field.type)}
                  </div>
                  <div className="field-details">
                    <div className="field-label">
                      {field.label}
                      {field.required && (
                        <span className="required-badge">*</span>
                      )}
                    </div>
                    <div className="field-type">{field.type}</div>
                    {field.options && field.options.length > 0 && (
                      <div className="field-options">
                        Options: {field.options.map((o) => o.label).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <Button
              onClick={() => {
                setPreview(null);
                setDescription("");
              }}
              className="btn btn-secondary"
            >
              Generate Again
            </Button>
            <Button onClick={handleApply} className="btn btn-primary">
              Apply Fields
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
