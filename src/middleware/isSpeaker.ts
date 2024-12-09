import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isSpeaker = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userType: string;
      id: number;
    };

    if (decoded.userType !== "speaker") {
      return res
        .status(403)
        .json({ message: "Access denied. Only speakers are allowed" });
    }

    req.body.userId = decoded.id; // Attach user ID to the request for use in the controller
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};

export { isSpeaker };
