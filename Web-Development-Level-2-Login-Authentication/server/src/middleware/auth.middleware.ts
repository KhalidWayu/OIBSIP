import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

// Extend Express Request to include the authenticated user ID
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Authentication token required.",
      });
    }

    // Extract the token after "Bearer "
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Authentication token required.",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Internal server error",
      });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Validate the user ID in the token
    if (
      typeof decoded.userId !== "number" ||
      !Number.isInteger(decoded.userId) ||
      decoded.userId <= 0
    ) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    // Attach the authenticated user ID to the request
    req.userId = decoded.userId;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
};