import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      userType: string;
    };

    req.body.userId = decoded.id; // Attach user ID to the request object
    req.body.userType = decoded.userType; // Attach userType to the request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

const isUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.userType !== "user") {
    return res
      .status(403)
      .json({ message: "Access denied. Users only can accces" });
  }
  next();
};

const isSpeaker = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.userType !== "speaker") {
    return res.status(403).json({ message: "Access denied. Speakers only" });
  }
  next();
};

export { verifyToken, isUser, isSpeaker };
