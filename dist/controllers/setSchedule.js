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
exports.setSchedule = void 0;
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const setSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, timeSlots, availableSlots } = req.body;
        const speakerId = req.body.userId; // The ID of the speaker (set by auth middleware)
        // Check if the time slots are within the allowed range (9 AM to 4 PM)
        const validTimeSlots = timeSlots.every((slot) => {
            const [startHour] = slot.split(":").map(Number);
            return startHour >= 9 && startHour < 16;
        });
        if (!validTimeSlots) {
            return res.status(400).json({
                message: "Invalid time slots. Time slots must be between 9 AM and 4 PM.",
            });
        }
        // Format and create the availability slots in the database
        const availabilityData = timeSlots.map((timeSlot) => ({
            speakerId,
            date: new Date(date),
            timeSlot,
            availableSlots: availableSlots || 1, // Default to 1 if not provided
        }));
        // Delete existing availability for the date to avoid duplicates
        yield client.speakerAvailability.deleteMany({
            where: {
                speakerId,
                date: new Date(date),
            },
        });
        // Add new availability slots
        yield client.speakerAvailability.createMany({
            data: availabilityData,
        });
        res.status(200).json({ message: "Schedule updated successfully" });
    }
    catch (error) {
        console.error("Error setting schedule:", error);
        res.status(500).json({ message: "Failed to set schedule" });
    }
});
exports.setSchedule = setSchedule;
