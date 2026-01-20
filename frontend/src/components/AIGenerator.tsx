import { useState } from 'react';
import { CreateFieldDto, FieldType, GeneratedFormResponse } from '../types';
import { api } from '../services/api';

interface AIGeneratorProps {
  onGenerate: (fields: CreateFieldDto[]) => void;
  onCancel: () => void;
}

export default function AIGenerator({ onGenerate, onCancel }: AIGeneratorProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<GeneratedFormResponse | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await api.ai.generateForm({ description: description.trim() });
      setPreview(result);
    } catch (err) {
      setError('Failed to generate form. Please try again.');
      console.error('Error generating form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (preview?.fields) {
      onGenerate(preview.fields);
    }
  };

  const getFieldTypeIcon = (type: FieldType) => {
    switch (type) {
      case FieldType.TEXT:
        return '📝';
      case FieldType.NUMBER:
        return '🔢';
      case FieldType.DROPDOWN:
        return '📋';
      default:
        return '❓';
    }
  };

  return (
    <div className="ai-generator">
      <h3>AI Form Generator</h3>
      <p className="help-text">
        Describe the form you want to create in natural language, and AI will generate the fields for you.
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

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {!preview && (
        <div className="modal-actions">
          <button onClick={onCancel} disabled={loading} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="btn btn-primary"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}

      {preview && (
        <>
          <div className="preview-section">
            <h4>Preview Generated Fields</h4>
            <div className="field-preview-list">
              {preview.fields.map((field, index) => (
                <div key={index} className="field-preview-item">
                  <div className="field-icon">{getFieldTypeIcon(field.type)}</div>
                  <div className="field-details">
                    <div className="field-label">
                      {field.label}
                      {field.required && <span className="required-badge">*</span>}
                    </div>
                    <div className="field-type">{field.type}</div>
                    {field.options && field.options.length > 0 && (
                      <div className="field-options">
                        Options: {field.options.map(o => o.label).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button
              onClick={() => {
                setPreview(null);
                setDescription('');
              }}
              className="btn btn-secondary"
            >
              Generate Again
            </button>
            <button onClick={handleApply} className="btn btn-primary">
              Apply Fields
            </button>
          </div>
        </>
      )}
    </div>
  );
}

