"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpeaker = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware to check if the user is a speaker
const isSpeaker = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Get the token from Authorization header
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.userType !== "speaker") {
            return res
                .status(403)
                .json({ message: "Access denied. Only speakers are allowed" });
        }
        req.body.userId = decoded.id; // Attach user ID to the request for use in the controller
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized access" });
    }
};
exports.isSpeaker = isSpeaker;
