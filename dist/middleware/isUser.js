"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isUser = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if the user type is 'user'
        if (decoded.userType !== "user") {
            return res
                .status(403)
                .json({ message: "Access denied. Only users are allowed" });
        }
        // Attach the user ID to the request object
        req.body.userId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized access" });
    }
};
exports.isUser = isUser;
