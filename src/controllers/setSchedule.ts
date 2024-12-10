import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const setSchedule = async (req: Request, res: Response) => {
  try {
    const { date, timeSlots, availableSlots } = req.body;
    const speakerId = req.body.userId; // The ID of the speaker (set by auth middleware)

    // Check if the time slots are within the allowed range (9 AM to 4 PM)
    const validTimeSlots = timeSlots.every((slot: string) => {
      const [startHour] = slot.split(":").map(Number);
      return startHour >= 9 && startHour < 16;
    });

    if (!validTimeSlots) {
      return res.status(400).json({
        message:
          "Invalid time slots. Time slots must be between 9 AM and 4 PM.",
      });
    }

    // Format and create the availability slots in the database
    const availabilityData = timeSlots.map((timeSlot: string) => ({
      speakerId,
      date: new Date(date),
      timeSlot,
      availableSlots: availableSlots || 1, // Default to 1 if not provided
    }));

    // Delete existing availability for the date to avoid duplicates
    await client.speakerAvailability.deleteMany({
      where: {
        speakerId,
        date: new Date(date),
      },
    });

    // Add new availability slots
    await client.speakerAvailability.createMany({
      data: availabilityData,
    });

    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (error) {
    console.error("Error setting schedule:", error);
    res.status(500).json({ message: "Failed to set schedule" });
  }
};

export { setSchedule };
