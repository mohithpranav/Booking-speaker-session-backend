import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/emailService";

const client = new PrismaClient();

const bookSession = async (req: Request, res: Response) => {
  try {
    const { speakerId, date, timeSlot, slotsBooked = 1 } = req.body;
    const userId = req.body.userId;

    const availability = await client.speakerAvailability.findUnique({
      where: {
        speakerId_date_timeSlot: {
          speakerId,
          date: new Date(date),
          timeSlot,
        },
      },
    });

    if (!availability || availability.availableSlots < slotsBooked) {
      return res.status(400).json({ message: "Not enough available slots" });
    }

    const updatedSlots = availability.availableSlots - slotsBooked;

    await client.speakerAvailability.update({
      where: {
        speakerId_date_timeSlot: {
          speakerId,
          date: new Date(date),
          timeSlot,
        },
      },
      data: {
        availableSlots: updatedSlots,
        isBooked: updatedSlots === 0,
      },
    });

    const booking = await client.booking.create({
      data: {
        userId,
        speakerId,
        date: new Date(date),
        timeSlot,
        slotsBooked,
      },
    });

    const speaker = await client.user.findUnique({
      where: { id: speakerId },
      select: { email: true, firstName: true },
    });

    const user = await client.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true },
    });

    if (!speaker || !user) {
      return res.status(404).json({ message: "User or speaker not found" });
    }

    const speakerEmail = speaker.email;
    const userEmail = user.email;

    const bookingDetails = `Date: ${date}\nTime Slot: ${timeSlot}\nSlots Booked: ${slotsBooked}`;

    await sendEmail(
      speakerEmail,
      "New Session Booking",
      `Hello ${speaker.firstName},\n\nYou have a new session booking:\n\n${bookingDetails}\n\nThank you!`
    );

    await sendEmail(
      userEmail,
      "Session Booking Confirmation",
      `Hello ${user.firstName},\n\nYour session has been booked successfully:\n\n${bookingDetails}\n\nThank you!`
    );

    res.status(200).json({ message: "Session booked successfully", booking });
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({ message: "Failed to book session" });
  }
};

export { bookSession };
