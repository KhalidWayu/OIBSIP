export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  completed?: boolean;
  dueDate?: string | null;
}

export type TaskStatus = "all" | "completed" | "pending";

export interface TaskPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface TasksResponse {
  count: number;
  pagination: TaskPagination;
  tasks: Task[];
}

export interface TaskResponse {
  message?: string;
  task: Task;
}
