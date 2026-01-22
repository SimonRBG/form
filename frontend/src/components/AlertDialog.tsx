import { Button } from "@/components/ui/button";

interface AlertDialogProps {
  message: string;
  onClose: () => void;
}

export default function AlertDialog({ message, onClose }: AlertDialogProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="alert-content">
          <h3>Alert</h3>
          <p>{message}</p>
          <div className="modal-actions">
            <Button onClick={onClose} className="btn btn-primary">
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
