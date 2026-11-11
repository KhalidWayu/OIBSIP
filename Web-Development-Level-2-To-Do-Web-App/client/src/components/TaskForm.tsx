import { useState, type FormEvent } from "react";
import type { CreateTaskData } from "../types/task";

interface TaskFormProps {
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
}

function TaskForm({
  onSubmit,
  onCancel,
  submitting = false,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task title.");
      return;
    }

    if (trimmedTitle.length > 120) {
      setError("The title cannot exceed 120 characters.");
      return;
    }

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });

      setTitle("");
      setDescription("");
      setDueDate("");
    } catch {
      setError("Unable to create the task. Please try again.");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add a New Task</h2>

      <div className="form-group">
        <label htmlFor="task-title">Task Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you need to do?"
          maxLength={120}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add some details (optional)"
          maxLength={1000}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-due-date">Due Date (optional)</label>
        <input
          id="task-due-date"
          type="datetime-local"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="task-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Task"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
