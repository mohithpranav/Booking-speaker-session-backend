import { Router, RequestHandler } from "express";
import { signup, verifyOtp, login } from "../controllers/authController";
import { setupSpeakerProfile } from "../controllers/speakerController";
import { getSpeakers } from "../controllers/getSpeakers";
import { bookSession } from "../controllers/booking";
import { verifyToken, isUser, isSpeaker } from "../middleware/authMiddleware";
import { setSchedule } from "../controllers/setSchedule";

const router = Router();

router.post("/signup", signup as RequestHandler);
router.post("/verify-otp", verifyOtp as RequestHandler);
router.post("/login", login as RequestHandler);
router.post(
  "/speaker/setup",
  verifyToken as RequestHandler,
  isSpeaker as RequestHandler,
  setupSpeakerProfile as RequestHandler
);
router.post(
  "/speaker/schedule",
  verifyToken as RequestHandler,
  isSpeaker as RequestHandler,
  setSchedule as RequestHandler
);
router.get(
  "/speaker/profile",
  verifyToken as RequestHandler,
  isUser as RequestHandler,
  getSpeakers as RequestHandler
);
router.post(
  "/booking",
  verifyToken as RequestHandler,
  isUser as RequestHandler,
  bookSession as RequestHandler
);

export default router;
