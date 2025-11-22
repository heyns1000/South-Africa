import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized - Please log in",
    });
  }
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // Allows both authenticated and unauthenticated requests
  next();
}
