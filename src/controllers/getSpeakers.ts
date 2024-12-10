import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const getSpeakers = async (req: Request, res: Response) => {
  try {
    const speakers = await client.speakerProfile.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        speakerAvailability: true,
      },
    });
    res.status(200).json(speakers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching speaker",
    });
  }
};

export { getSpeakers };
