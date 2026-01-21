import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-content">
          <h3>Confirm</h3>
          <p>{message}</p>
          <div className="modal-actions">
            <Button onClick={onConfirm} className="btn btn-primary">
              Confirm
            </Button>
            <Button onClick={onCancel} className="btn btn-secondary">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
