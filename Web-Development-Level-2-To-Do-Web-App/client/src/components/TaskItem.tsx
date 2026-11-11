import { useState } from "react";
import {
  Check,
  Pencil,
  Trash2,
  X,
  CalendarDays,
} from "lucide-react";
import type { Task, UpdateTaskData } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, data: UpdateTaskData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function TaskItem({
  task,
  onToggle,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    if (title.trim().length > 120 || description.length > 1000) {
      setError("Please check the title and description lengths.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onUpdate(task.id, {
        title: title.trim(),
        description: description.trim() || null,
      });
      setEditing(false);
    } catch {
      setError("Unable to update this task.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await onDelete(task.id);
    } catch {
      setError("Unable to delete this task.");
    }
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleString()
    : null;

  return (
    <article className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-checkbox">
        <button
          type="button"
          className="toggle-button"
          onClick={() => onToggle(task.id, !task.completed)}
          aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          {task.completed && <Check size={16} />}
        </button>
      </div>

      <div className="task-details">
        {editing ? (
          <div className="task-edit-form">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              aria-label="Task title"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={1000}
              rows={2}
              aria-label="Task description"
            />
            <div className="task-actions">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                aria-label="Save changes"
              >
                <Check size={16} />
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setTitle(task.title);
                  setDescription(task.description || "");
                  setEditing(false);
                  setError("");
                }}
                disabled={saving}
                aria-label="Cancel editing"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            {formattedDueDate && (
              <span className="task-due-date">
                <CalendarDays size={14} />
                {formattedDueDate}
              </span>
            )}
            <span className="task-status">
              {task.completed ? "Completed" : "Pending"}
            </span>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      {!editing && (
        <div className="task-actions">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            title="Edit task"
          >
            <Pencil size={17} />
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </article>
  );
}

export default TaskItem;
