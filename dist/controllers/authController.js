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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyOtp = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpGenerater_1 = require("../utils/otpGenerater");
const email_1 = require("../utils/email");
const client = new client_1.PrismaClient();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, userType } = req.body;
        const existingUser = yield client.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const otp = (0, otpGenerater_1.generateOtp)();
        const newUser = yield client.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                userType,
                otp,
            },
        });
        yield (0, email_1.sendEmail)(email, "Account Verification", `Your OTP is ${otp}`);
        res.json({
            message: "You have Signup successfullly",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error in Signup" });
        console.log(error);
    }
});
exports.signup = signup;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield client.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.otp === otp) {
            yield client.user.update({
                where: {
                    email,
                },
                data: {
                    isVerified: true,
                    otp: null,
                },
            });
            return res.json({ message: "OTP verified successfully" });
        }
        else {
            return res.status(400).json({ message: "OTP is not valid" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.verifyOtp = verifyOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: "User not verified" });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ message: "Login successfull", token });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.login = login;
