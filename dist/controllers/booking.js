"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSession = void 0;
const client_1 = require("@prisma/client");
const emailService_1 = require("../utils/emailService");
const client = new client_1.PrismaClient();
const bookSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { speakerId, date, timeSlot, slotsBooked = 1 } = req.body;
        const userId = req.body.userId;
        const availability = yield client.speakerAvailability.findUnique({
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
        yield client.speakerAvailability.update({
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
        const booking = yield client.booking.create({
            data: {
                userId,
                speakerId,
                date: new Date(date),
                timeSlot,
                slotsBooked,
            },
        });
        const speaker = yield client.user.findUnique({
            where: { id: speakerId },
            select: { email: true, firstName: true },
        });
        const user = yield client.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true },
        });
        if (!speaker || !user) {
            return res.status(404).json({ message: "User or speaker not found" });
        }
        const speakerEmail = speaker.email;
        const userEmail = user.email;
        const bookingDetails = `Date: ${date}\nTime Slot: ${timeSlot}\nSlots Booked: ${slotsBooked}`;
        yield (0, emailService_1.sendEmail)(speakerEmail, "New Session Booking", `Hello ${speaker.firstName},\n\nYou have a new session booking:\n\n${bookingDetails}\n\nThank you!`);
        yield (0, emailService_1.sendEmail)(userEmail, "Session Booking Confirmation", `Hello ${user.firstName},\n\nYour session has been booked successfully:\n\n${bookingDetails}\n\nThank you!`);
        res.status(200).json({ message: "Session booked successfully", booking });
    }
    catch (error) {
        console.error("Error booking session:", error);
        res.status(500).json({ message: "Failed to book session" });
    }
});
exports.bookSession = bookSession;
