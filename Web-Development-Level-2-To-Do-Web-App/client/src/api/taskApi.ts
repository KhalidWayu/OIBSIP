import api from "./axios";
import type {
  CreateTaskData,
  Task,
  TaskResponse,
  TasksResponse,
  TaskStatus,
  UpdateTaskData,
} from "../types/task";

interface GetTasksParams {
  status?: TaskStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export const getTasks = async (
  params: GetTasksParams = {}
): Promise<TasksResponse> => {
  const response = await api.get<TasksResponse>("/tasks", { params });
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get<{ task: Task }>(`/tasks/${id}`);
  return response.data.task;
};

export const createTask = async (
  data: CreateTaskData
): Promise<TaskResponse> => {
  const response = await api.post<TaskResponse>("/tasks", data);
  return response.data;
};

export const updateTask = async (
  id: number,
  data: UpdateTaskData
): Promise<TaskResponse> => {
  const response = await api.patch<TaskResponse>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (
  id: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
};
