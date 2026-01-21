import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Field, CreateFieldDto, Form } from "../types";
import { useFormStore } from "../stores/form";
import { formActions } from "../actions/formActions";
import FormMetadata from "../components/FormMetadata";
import FieldList from "../components/FieldList";
import FieldEditor from "../components/FieldEditor";
import AIGenerator from "../components/AIGenerator";
import ConfirmDialog from "../components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { IoMdAdd, IoMdArrowBack } from "react-icons/io";
import { FaMagic } from "react-icons/fa";
import { areFormsEqual } from "@/util/FormUtil";

export default function FormEditor() {
  const navigate = useNavigate();
  const isNew = location.pathname === "/forms/new";
  const id = isNew ? null : location.pathname.split("/")[2];

  const {
    form,
    initialForm,
    setForm,
    updateMetadata,
    addField,
    updateField,
    deleteField,
    reorderFields,
    clearForm,
  } = useFormStore();

  // Compute hasUnsavedChanges locally
  const hasUnsavedChanges = useMemo(
    () => !areFormsEqual(form, initialForm),
    [form, initialForm],
  );

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadForm(id);
    } else {
      // Initialize empty form for new form
      setForm({
        id: "",
        name: "",
        slug: "",
        published: false,
        fieldOrder: [],
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Cleanup on unmount
    return () => {
      clearForm();
    };
  }, [id, isNew]);

  const loadForm = async (formId: string) => {
    try {
      setLoading(true);
      setError(null);
      await formActions.loadForm(formId);
    } catch (err) {
      setError("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMetadata = (name: string, slug: string) => {
    updateMetadata(name, slug);
  };

  const handleCreateForm = async () => {
    if (!form || !form.name.trim() || !form.slug.trim()) {
      setError("Form name and slug are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const newForm = await formActions.createForm({
        name: form.name.trim(),
        slug: form.slug.trim(),
      });
      navigate(`/forms/${newForm.id}/edit`, { replace: true });
    } catch (err) {
      setError("Failed to create form");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFieldClick = () => {
    setEditingField(null);
    setShowFieldEditor(true);
  };

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const handleSaveField = (fieldData: CreateFieldDto) => {
    if (!form || isNew) return;

    if (editingField) {
      // Update existing field in store
      updateField(editingField.id, fieldData);
    } else {
      // Add new field to store with temporary ID
      const tempId = `temp-${Date.now()}`;
      const newField: Field = {
        id: tempId,
        formId: form.id,
        ...fieldData,
      };
      addField(newField);
    }
    setShowFieldEditor(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    setFieldToDelete(fieldId);
    setShowConfirmDialog(true);
  };

  const confirmDeleteField = () => {
    if (fieldToDelete) {
      deleteField(fieldToDelete);
      setShowConfirmDialog(false);
      setFieldToDelete(null);
    }
  };

  const cancelDeleteField = () => {
    setShowConfirmDialog(false);
    setFieldToDelete(null);
  };

  const handleReorderFields = (newOrder: string[]) => {
    reorderFields(newOrder);
  };

  const handleSaveAll = async () => {
    if (!form || isNew) return;

    try {
      setSaving(true);
      setError(null);
      await formActions.saveForm(form.id, form);
    } catch (err) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!form) return;

    // Save all changes before publishing
    if (hasUnsavedChanges) {
      await handleSaveAll();
    }

    try {
      setSaving(true);
      setError(null);
      await formActions.publishForm(form.id);
    } catch (err) {
      setError("Failed to publish form");
    } finally {
      setSaving(false);
    }
  };

  const handleAIGenerate = (fields: CreateFieldDto[]) => {
    if (!form || isNew) return;

    // Add generated fields to store with temp IDs
    fields.forEach((fieldData, index) => {
      const tempField: Field = {
        id: `temp-ai-${Date.now()}-${index}`,
        formId: form.id,
        ...fieldData,
      };
      addField(tempField);
    });

    setShowAIGenerator(false);
  };

  const renderNewFormVariant = () => {
    return (
      <div className="flex justify-end">
        <Button
          onClick={handleCreateForm}
          variant="default"
          className="btn btn-primary"
        >
          Create Form
        </Button>
      </div>
    );
  };

  const renderEditFormVariant = (form: Form) => {
    return (
      <>
        <div className="section-header">
          <h2>Fields</h2>
          <div className="action-buttons">
            <Button
              onClick={() => setShowAIGenerator(true)}
              variant="secondary"
              className="btn btn-ai"
            >
              <FaMagic />
            </Button>
            <Button
              onClick={handleAddFieldClick}
              variant="default"
              className="btn btn-secondary"
            >
              <IoMdAdd />
            </Button>
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
    );
  };

  const renderFieldEditor = (editingField: Field | null) => {
    return (<div
      className="modal-overlay"
      onClick={() => setShowFieldEditor(false)}
    >
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
    </div>)
  };

  const renderAIGenerator = () => {
    return (<div
      className="modal-overlay"
      onClick={() => setShowAIGenerator(false)}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <AIGenerator
          onGenerate={handleAIGenerate}
          onCancel={() => setShowAIGenerator(false)}
        />
      </div>
    </div>)
  };

  const renderConfirmDialog = () => {
    return (
      <ConfirmDialog
        message="Are you sure you want to delete this field?"
        onConfirm={confirmDeleteField}
        onCancel={cancelDeleteField}
      />
    );
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
        <h1>{isNew ? "Create Form" : "Edit Form"}</h1>
        <div className="action-buttons">
          <Button
            onClick={() => navigate("/")}
            variant="secondary"
            className="btn btn-secondary"
          >
            <IoMdArrowBack />
          </Button>
          {!isNew && (
            <>
              <Button
                onClick={handleSaveAll}
                disabled={saving || !hasUnsavedChanges}
                variant="default"
                className="btn btn-secondary"
              >
                Save
              </Button>
              <Button
                onClick={handlePublish}
                disabled={saving || form.published}
                variant="default"
                className="btn btn-primary"
              >
                {form.published ? "Published" : "Publish"}
              </Button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="editor-layout">
        <div className="editor-main">
          <FormMetadata
            name={form.name}
            slug={form.slug}
            onSave={handleSaveMetadata}
            disabled={saving}
          />

          {isNew && renderNewFormVariant()}
          {!isNew && renderEditFormVariant(form)}
        </div>

        {showFieldEditor && renderFieldEditor(editingField)}
        {showAIGenerator && renderAIGenerator()}
        {showConfirmDialog && renderConfirmDialog()}
      </div>
    </div>
  );
}
