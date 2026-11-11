import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ListTodo, Plus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/taskApi";
import type {
  Task,
  TaskStatus,
  TaskPagination,
  CreateTaskData,
  UpdateTaskData,
} from "../types/task";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<TaskPagination>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [status, setStatus] = useState<TaskStatus>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTasks({
          status,
          search,
          page: pagination.page,
          limit: pagination.limit,
        });

        if (!cancelled) {
          setTasks(response.tasks);
          setPagination(response.pagination);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load tasks. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [status, search, pagination.page, pagination.limit, refresh]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    setSubmitting(true);

    try {
      await createTask(data);
      setShowForm(false);
      setPageToFirst();
      setRefresh((current) => current + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const setPageToFirst = () => {
    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  };

  const handleToggleTask = async (
    id: number,
    completed: boolean
  ) => {
    try {
      await updateTask(id, { completed });
      setRefresh((current) => current + 1);
    } catch {
      setError("Unable to change the task status.");
      throw new Error("Task status update failed.");
    }
  };

  const handleUpdateTask = async (
    id: number,
    data: UpdateTaskData
  ) => {
    await updateTask(id, data);
    setRefresh((current) => current + 1);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setRefresh((current) => current + 1);
    } catch {
      setError("Unable to delete the task.");
      throw new Error("Task deletion failed.");
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPagination((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const changePage = (newPage: number) => {
    setPagination((current) => ({
      ...current,
      page: newPage,
    }));
  };

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>My Tasks</h1>
          <p>Welcome back, {user?.name || "User"}!</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <div className="tasks-toolbar">
          <div>
            <h2>
              <ListTodo size={23} />
              Your Tasks
            </h2>
            <p>{pagination.totalItems} tasks in total</p>
          </div>

          <button
            type="button"
            className="add-task-button"
            onClick={() => setShowForm((current) => !current)}
          >
            <Plus size={18} />
            {showForm ? "Close Form" : "Add Task"}
          </button>
        </div>

        {showForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        )}

        <form className="task-search" onSubmit={handleSearch}>
          <Search size={18} />
          <input
            type="search"
            placeholder="Search your tasks..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="task-filters">
          {(["all", "pending", "completed"] as TaskStatus[]).map(
            (filter) => (
              <button
                key={filter}
                type="button"
                className={status === filter ? "active" : ""}
                onClick={() => handleStatusChange(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            )
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="tasks-message">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="dashboard-empty">
            <ListTodo size={48} />
            <h3>No tasks found</h3>
            <p>
              {search || status !== "all"
                ? "Try changing your search or filter."
                : "Add your first task to get started."}
            </p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => changePage(pagination.page - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => changePage(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
