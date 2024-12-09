import express from "express";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;
