import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Field, CreateFieldDto } from '../types';
import { api } from '../services/api';
import FormMetadata from '../components/FormMetadata';
import FieldList from '../components/FieldList';
import FieldEditor from '../components/FieldEditor';
import AIGenerator from '../components/AIGenerator';

export default function FormEditor() {
  const navigate = useNavigate();
  const isNew = location.pathname === '/forms/new';
  const id = isNew ? null : location.pathname.split('/')[2];

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadForm(id);
    } else {
      // Initialize empty form for new form
      setForm({
        id: '',
        name: '',
        slug: '',
        published: false,
        fieldOrder: [],
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [id, isNew]);

  const loadForm = async (formId: string) => {
    try {
      setLoading(true);
      const data = await api.forms.get(formId);
      setForm(data);
      setError(null);
    } catch (err) {
      setError('Failed to load form');
      console.error('Error loading form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetadata = async (name: string, slug: string) => {
    if (!form) return;

    try {
      setSaving(true);
      if (isNew) {
        const newForm = await api.forms.create({ name, slug });
        setForm(newForm);
        navigate(`/forms/${newForm.id}/edit`, { replace: true });
      } else {
        const updatedForm = await api.forms.update(form.id, { name, slug });
        setForm(updatedForm);
      }
      setError(null);
    } catch (err) {
      setError('Failed to save form');
      console.error('Error saving form:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddField = () => {
    setEditingField(null);
    setShowFieldEditor(true);
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const handleSaveField = async (fieldData: CreateFieldDto) => {
    if (!form || isNew) return;

    try {
      if (editingField) {
        // Update existing field
        const updatedField = await api.fields.update(form.id, editingField.id, fieldData);
        setForm({
          ...form,
          fields: form.fields?.map(f => f.id === updatedField.id ? updatedField : f),
        });
      } else {
        // Create new field
        const newField = await api.fields.create(form.id, fieldData);
        setForm({
          ...form,
          fields: [...(form.fields || []), newField],
          fieldOrder: [...form.fieldOrder, newField.id],
        });
      }
      setShowFieldEditor(false);
      setEditingField(null);
      setError(null);
    } catch (err) {
      setError('Failed to save field');
      console.error('Error saving field:', err);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    if (!form || !confirm('Are you sure you want to delete this field?')) {
      return;
    }

    try {
      await api.fields.delete(form.id, fieldId);
      setForm({
        ...form,
        fields: form.fields?.filter(f => f.id !== fieldId),
        fieldOrder: form.fieldOrder.filter(id => id !== fieldId),
      });
      setError(null);
    } catch (err) {
      setError('Failed to delete field');
      console.error('Error deleting field:', err);
    }
  };

  const handleReorderFields = async (newOrder: string[]) => {
    if (!form) return;

    try {
      const updatedForm = await api.forms.update(form.id, { fieldOrder: newOrder });
      setForm(updatedForm);
      setError(null);
    } catch (err) {
      setError('Failed to reorder fields');
      console.error('Error reordering fields:', err);
    }
  };

  const handlePublish = async () => {
    if (!form) return;

    try {
      setSaving(true);
      const updatedForm = await api.forms.publish(form.id);
      setForm(updatedForm);
      setError(null);
    } catch (err) {
      setError('Failed to publish form');
      console.error('Error publishing form:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = async (fields: CreateFieldDto[]) => {
    if (!form || isNew) return;

    try {
      // Create all generated fields
      const createdFields = await Promise.all(
        fields.map(fieldData => api.fields.create(form.id, fieldData))
      );

      setForm({
        ...form,
        fields: [...(form.fields || []), ...createdFields],
        fieldOrder: [...form.fieldOrder, ...createdFields.map(f => f.id)],
      });
      setShowAIGenerator(false);
      setError(null);
    } catch (err) {
      setError('Failed to generate fields');
      console.error('Error generating fields:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading form...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container">
        <div className="alert alert-error">Form not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>{isNew ? 'Create Form' : 'Edit Form'}</h1>
        <div className="action-buttons">
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Back to List
          </button>
          {!isNew && (
            <button
              onClick={handlePublish}
              disabled={saving || form.published}
              className="btn btn-success"
            >
              {form.published ? 'Published' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="editor-layout">
        <div className="editor-main">
          <FormMetadata
            name={form.name}
            slug={form.slug}
            onSave={handleSaveMetadata}
            disabled={saving}
          />

          {!isNew && (
            <>
              <div className="section-header">
                <h2>Fields</h2>
                <div className="action-buttons">
                  <button
                    onClick={() => setShowAIGenerator(true)}
                    className="btn btn-secondary"
                  >
                    AI Generate
                  </button>
                  <button onClick={handleAddField} className="btn btn-primary">
                    Add Field
                  </button>
                </div>
              </div>

              <FieldList
                fields={form.fields || []}
                fieldOrder={form.fieldOrder}
                onEdit={handleEditField}
                onDelete={handleDeleteField}
                onReorder={handleReorderFields}
              />
            </>
          )}
        </div>

        {showFieldEditor && (
          <div className="modal-overlay" onClick={() => setShowFieldEditor(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <FieldEditor
                field={editingField}
                onSave={handleSaveField}
                onCancel={() => {
                  setShowFieldEditor(false);
                  setEditingField(null);
                }}
              />
            </div>
          </div>
        )}

        {showAIGenerator && (
          <div className="modal-overlay" onClick={() => setShowAIGenerator(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <AIGenerator
                onGenerate={handleAIGenerate}
                onCancel={() => setShowAIGenerator(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

