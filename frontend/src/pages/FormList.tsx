import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormListStore } from "../stores/formList";
import { formListActions } from "../actions/formListActions";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { CiEdit, CiTrash } from "react-icons/ci";
import ConfirmDialog from "../components/ConfirmDialog";

export default function FormList() {
  const { forms, loading, error } = useFormListStore();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    await formListActions.loadForms();
  };

  const handleDelete = (id: string) => {
    setFormToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;

    try {
      await formListActions.deleteForm(formToDelete);
    } finally {
      setShowConfirmDialog(false);
      setFormToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setFormToDelete(null);
  };

  const handleCreateForm = () => {
    navigate("/forms/new");
  };

  const handleEditForm = (id: string) => {
    navigate(`/forms/${id}/edit`);
  };

  const renderFormList = () => {
    return (
      <div className="form-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id}>
                <td>{form.name}</td>
                <td>
                  <code>{form.slug}</code>
                </td>
                <td>
                  <span
                    className={`badge ${form.published ? "badge-primary" : "badge-secondary"}`}
                  >
                    {form.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <Button
                      onClick={() => handleEditForm(form.id)}
                      className="btn btn-sm btn-secondary"
                    >
                      <CiEdit />
                    </Button>
                    <Button
                      onClick={() => handleDelete(form.id)}
                      className="btn btn-sm btn-danger"
                    >
                      <CiTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderConfirmDialog = () => {
    return (
      <ConfirmDialog
        message="Are you sure you want to delete this form?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading forms...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Form Administration</h1>
        <Button onClick={handleCreateForm} className="btn btn-primary">
          <IoMdAdd />
        </Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {forms.length === 0 ? (
        <div className="empty-state">
          <p>No forms yet. Create your first form to get started!</p>
        </div>
      ) : (
        renderFormList()
      )}

      {showConfirmDialog && renderConfirmDialog()}
    </div>
  );
}
