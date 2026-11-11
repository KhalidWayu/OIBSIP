
import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

// Validate task creation
const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

// Validate task updates
const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided." }
);

// Helper to validate task IDs
function getTaskId(value: string | string[] | undefined): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// POST /api/tasks - Create a task
router.post("/", async (req: Request, res: Response) => {
  try {
    const validation = createTaskSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid task details.",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const userId = res.locals.userId as number;
    const { title, description, dueDate } = validation.data;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    return res.status(201).json({
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Unable to create task.",
    });
  }
});


// GET /api/tasks - Get all tasks belonging to the logged-in user
// Supports:
// ?status=all|completed|pending
// ?search=keyword
// ?page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as number;

    const status = req.query.status ?? "all";
    const search = req.query.search;
    const pageValue = req.query.page ?? "1";
    const limitValue = req.query.limit ?? "10";

    // Validate status
    if (
      typeof status !== "string" ||
      !["all", "completed", "pending"].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status filter.",
      });
    }

    // Validate search
    if (search !== undefined && typeof search !== "string") {
      return res.status(400).json({
        message: "Invalid search query.",
      });
    }

    // Validate pagination values
    if (
      typeof pageValue !== "string" ||
      !/^[1-9]\d*$/.test(pageValue) ||
      typeof limitValue !== "string" ||
      !/^[1-9]\d*$/.test(limitValue)
    ) {
      return res.status(400).json({
        message: "Page and limit must be positive integers.",
      });
    }

    const page = Number(pageValue);
    const limit = Number(limitValue);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      limit > 100 ||
      !Number.isSafeInteger((page - 1) * limit)
    ) {
      return res.status(400).json({
        message: "Invalid pagination values. Limit must not exceed 100.",
      });
    }

    const where: {
      userId: number;
      completed?: boolean;
      OR?: Array<{
        title?: { contains: string };
        description?: { contains: string };
      }>;
    } = { userId };

    // Apply status filter
    if (status === "completed") where.completed = true;
    if (status === "pending") where.completed = false;

    // Apply search filter
    if (typeof search === "string" && search.trim()) {
      const keyword = search.trim();

      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }

    const skip = (page - 1) * limit;

    // Retrieve tasks and total matching count
    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return res.status(200).json({
      count: tasks.length,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Unable to retrieve tasks.",
    });
  }
});


// GET /api/tasks/:id - Get one task
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = getTaskId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const userId = res.locals.userId as number;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Unable to retrieve task.",
    });
  }
});

// PATCH /api/tasks/:id - Update a task
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = getTaskId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const validation = updateTaskSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid task update.",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const userId = res.locals.userId as number;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const { dueDate, ...otherFields } = validation.data;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...otherFields,
        ...(dueDate !== undefined
          ? { dueDate: dueDate ? new Date(dueDate) : null }
          : {}),
      },
    });

    return res.status(200).json({
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Unable to update task.",
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = getTaskId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "Invalid task ID.",
      });
    }

    const userId = res.locals.userId as number;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Unable to delete task.",
    });
  }
});

export default router;
