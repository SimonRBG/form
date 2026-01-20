import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../types';
import { api } from '../services/api';

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await api.forms.list();
      setForms(data);
      setError(null);
    } catch (err) {
      setError('Failed to load forms');
      console.error('Error loading forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      await api.forms.delete(id);
      setForms(forms.filter(f => f.id !== id));
    } catch (err) {
      setError('Failed to delete form');
      console.error('Error deleting form:', err);
    }
  };

  const handleCreateForm = () => {
    navigate('/forms/new');
  };

  const handleEditForm = (id: string) => {
    navigate(`/forms/${id}/edit`);
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
        <button onClick={handleCreateForm} className="btn btn-primary">
          Create Form
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {forms.length === 0 ? (
        <div className="empty-state">
          <p>No forms yet. Create your first form to get started!</p>
        </div>
      ) : (
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
                  <td><code>{form.slug}</code></td>
                  <td>
                    <span className={`badge ${form.published ? 'badge-success' : 'badge-warning'}`}>
                      {form.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditForm(form.id)}
                        className="btn btn-sm btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(form.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

