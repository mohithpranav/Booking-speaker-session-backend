"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSpeaker = exports.isUser = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id; // Attach user ID to the request object
        req.body.userType = decoded.userType; // Attach userType to the request object
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
const isUser = (req, res, next) => {
    if (req.body.userType !== "user") {
        return res
            .status(403)
            .json({ message: "Access denied. Users only can accces" });
    }
    next();
};
exports.isUser = isUser;
const isSpeaker = (req, res, next) => {
    if (req.body.userType !== "speaker") {
        return res.status(403).json({ message: "Access denied. Speakers only" });
    }
    next();
};
exports.isSpeaker = isSpeaker;
