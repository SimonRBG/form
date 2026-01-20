import { useState, useEffect } from 'react';

interface FormMetadataProps {
  name: string;
  slug: string;
  onSave: (name: string, slug: string) => void;
  disabled?: boolean;
}

export default function FormMetadata({ name, slug, onSave, disabled }: FormMetadataProps) {
  const [formName, setFormName] = useState(name);
  const [formSlug, setFormSlug] = useState(slug);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormName(name);
    setFormSlug(slug);
  }, [name, slug]);

  useEffect(() => {
    setHasChanges(formName !== name || formSlug !== slug);
  }, [formName, formSlug, name, slug]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (newName: string) => {
    setFormName(newName);
    // Auto-generate slug if slug is empty or was auto-generated
    if (!formSlug || formSlug === generateSlug(formName)) {
      setFormSlug(generateSlug(newName));
    }
  };

  const handleSave = () => {
    if (formName.trim() && formSlug.trim()) {
      onSave(formName.trim(), formSlug.trim());
    }
  };

  return (
    <div className="form-metadata-section">
      <h2>Form Details</h2>
      <div className="form-group">
        <label htmlFor="form-name">Form Name *</label>
        <input
          id="form-name"
          type="text"
          value={formName}
          onChange={(e) => handleNameChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter form name"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="form-slug">Slug *</label>
        <input
          id="form-slug"
          type="text"
          value={formSlug}
          onChange={(e) => setFormSlug(e.target.value)}
          disabled={disabled}
          placeholder="form-slug"
          className="form-control"
        />
        <small className="form-text">
          URL-friendly identifier (lowercase, hyphens, no spaces)
        </small>
      </div>

      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={disabled || !formName.trim() || !formSlug.trim()}
          className="btn btn-primary"
        >
          Save Form Details
        </button>
      )}
    </div>
  );
}

