import { Router } from "express";
import { signup, verifyOtp, login } from "../controllers/authController";
import { RequestHandler } from "express";
import { isSpeaker } from "../middleware/isSpeaker";
import { setupSpeakerProfile } from "../controllers/speakerController";

const router = Router();

router.post("/signup", signup as RequestHandler);
router.post("/verify-otp", verifyOtp as RequestHandler);
router.post("/login", login as RequestHandler);
router.post(
  "/speaker/profile",
  isSpeaker as RequestHandler,
  setupSpeakerProfile as RequestHandler
);

export default router;
