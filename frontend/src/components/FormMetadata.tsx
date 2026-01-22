import { useState, useEffect } from "react";

interface FormMetadataProps {
  name: string;
  slug: string;
  onSave: (name: string, slug: string) => void;
  disabled?: boolean;
}

export default function FormMetadata({
  name,
  slug,
  onSave,
  disabled,
}: FormMetadataProps) {
  const [formName, setFormName] = useState(name);
  const [formSlug, setFormSlug] = useState(slug);

  useEffect(() => {
    setFormName(name);
    setFormSlug(slug);
  }, [name, slug]);

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    setFormName(newName);

    // Auto-generate slug if slug is empty or was auto-generated
    const newSlug =
      !formSlug || formSlug === generateSlug(formName)
        ? generateSlug(trimmedName)
        : formSlug;

    setFormSlug(newSlug);

    // Update parent immediately with new values
    if (trimmedName && newSlug.trim()) {
      onSave(trimmedName, newSlug.trim());
    }
  };

  const handleSlugChange = (newSlug: string) => {
    const trimmedSlug = newSlug.trim();
    setFormSlug(newSlug);

    // Update parent immediately with new values
    if (formName.trim() && trimmedSlug) {
      onSave(formName.trim(), trimmedSlug);
    }
  };

  return (
    <div className="form-metadata-section">
      <h2>Form Details</h2>
      <div className="form-group">
        <label htmlFor="form-name">
          Form Name <span className="required-badge">*</span>
        </label>
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
        <label htmlFor="form-slug">
          Slug <span className="required-badge">*</span>
        </label>
        <input
          id="form-slug"
          type="text"
          value={formSlug}
          onChange={(e) => handleSlugChange(e.target.value)}
          disabled={disabled}
          placeholder="form-slug"
          className="form-control"
        />
        <small className="form-text">
          URL-friendly identifier (lowercase, hyphens, no spaces)
        </small>
      </div>
    </div>
  );
}
