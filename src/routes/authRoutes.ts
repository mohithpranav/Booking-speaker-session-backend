import { Router } from "express";
import { signup, verifyOtp, login } from "../controllers/authController";
import { RequestHandler } from "express";

const router = Router();

router.post("/signup", signup as RequestHandler);
router.post("/verify-otp", verifyOtp as RequestHandler);
router.post("/login", login as RequestHandler);

export default router;
