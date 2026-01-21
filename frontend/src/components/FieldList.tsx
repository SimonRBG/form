import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field, FieldType } from "../types";
import { Button } from "@/components/ui/button";
import { CiEdit, CiTrash } from "react-icons/ci";
import { getFieldTypeIcon } from "@/util/FieldUtil";
interface FieldListProps {
  fields: Field[];
  fieldOrder: string[];
  onEdit: (field: Field) => void;
  onDelete: (fieldId: string) => void;
  onReorder: (newOrder: string[]) => void;
}

interface SortableFieldItemProps {
  field: Field;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableFieldItem({
  field,
  onEdit,
  onDelete,
}: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="field-item">
      <div className="field-drag-handle" {...attributes} {...listeners}>
        ⋮⋮
      </div>
      <div className="field-info">
        <div className="field-icon">{getFieldTypeIcon(field.type)}</div>
        <div className="field-details">
          <div className="field-label">
            {field.label}
            {field.required && <span className="required-badge">*</span>}
          </div>
          <div className="field-type">{field.type}</div>
          {field.type === FieldType.DROPDOWN && field.options && (
            <div className="field-options">
              {field.options.length} option
              {field.options.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
      <div className="field-actions">
        <Button onClick={onEdit} className="btn btn-sm btn-secondary">
          <CiEdit />
        </Button>
        <Button onClick={onDelete} className="btn btn-sm btn-danger">
          <CiTrash />
        </Button>
      </div>
    </div>
  );
}

export default function FieldList({
  fields,
  fieldOrder,
  onEdit,
  onDelete,
  onReorder,
}: FieldListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fieldOrder.indexOf(active.id as string);
      const newIndex = fieldOrder.indexOf(over.id as string);
      const newOrder = arrayMove(fieldOrder, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  // Create ordered fields array based on fieldOrder
  const orderedFields = fieldOrder
    .map((id) => fields.find((f) => f.id === id))
    .filter((f): f is Field => f !== undefined);

  if (orderedFields.length === 0) {
    return (
      <div className="empty-state">
        <p>No fields yet. Add your first field to get started!</p>
      </div>
    );
  }

  return (
    <div className="field-list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fieldOrder}
          strategy={verticalListSortingStrategy}
        >
          {orderedFields.map((field) => (
            <SortableFieldItem
              key={field.id}
              field={field}
              onEdit={() => onEdit(field)}
              onDelete={() => onDelete(field.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
