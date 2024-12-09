import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Declare custom property
    }
  }
}
