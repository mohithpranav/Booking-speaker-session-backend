import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const setupSpeakerProfile = async (req: Request, res: Response) => {
  try {
    const { expertise, PricePerSession } = req.body;
    const userId = req.body.userId; // Extracted user ID from middleware

    const speaker = await client.user.findUnique({
      where: { id: userId },
    });

    if (!speaker || speaker.userType !== "speaker") {
      return res.status(403).json({
        message: "Access denied. Only speakers can perform this action",
      });
    }

    const existingProfile = await client.speakerProfile.findUnique({
      where: { userId: userId },
    });

    if (existingProfile) {
      await client.speakerProfile.update({
        where: { userId: userId },
        data: {
          expertise,
          PricePerSession,
        },
      });
      return res
        .status(200)
        .json({ message: "Speaker profile updated successfully" });
    } else {
      await client.speakerProfile.create({
        data: {
          userId,
          expertise,
          PricePerSession,
        },
      });
      return res
        .status(201)
        .json({ message: "Speaker profile created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating speaker profile" });
  }
};

export { setupSpeakerProfile };
