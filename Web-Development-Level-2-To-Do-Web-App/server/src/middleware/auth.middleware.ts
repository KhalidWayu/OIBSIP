
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: number;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Authentication token required.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({
      message: "Authentication configuration error.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    if (!Number.isInteger(decoded.userId)) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    res.locals.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}
