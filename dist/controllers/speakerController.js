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
exports.setupSpeakerProfile = void 0;
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
/**
 * Speaker Profile Setup Controller
 */
const setupSpeakerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expertise, PricePerSession } = req.body; // Ensure casing matches Prisma schema
        const userId = req.body.userId; // Extracted user ID from middleware
        // Find the speaker in the database
        const speaker = yield client.user.findUnique({
            where: { id: userId },
        });
        if (!speaker || speaker.userType !== "speaker") {
            return res.status(403).json({
                message: "Access denied. Only speakers can perform this action",
            });
        }
        // Check if the speaker already has a profile
        const existingProfile = yield client.speakerProfile.findUnique({
            where: { userId: userId },
        });
        if (existingProfile) {
            // Update the existing profile
            yield client.speakerProfile.update({
                where: { userId: userId },
                data: {
                    expertise,
                    PricePerSession,
                },
            });
            return res
                .status(200)
                .json({ message: "Speaker profile updated successfully" });
        }
        else {
            // Create a new speaker profile
            yield client.speakerProfile.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating speaker profile" });
    }
});
exports.setupSpeakerProfile = setupSpeakerProfile;
