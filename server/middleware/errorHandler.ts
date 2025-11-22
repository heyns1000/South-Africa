import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors,
    });
  }

  // Handle known error types
  if (err.message.includes("duplicate key value")) {
    return res.status(409).json({
      success: false,
      error: "Resource already exists",
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
}
