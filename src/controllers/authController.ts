import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/otpGenerater";
import { sendEmail } from "../utils/email";

const client = new PrismaClient();

const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;
    const existingUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    const newUser = await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
        otp,
      },
    });

    await sendEmail(email, "Account Verification", `Your OTP is ${otp}`);

    res.json({
      message: "You have Signup successfullly",
    });
  } catch (error) {
    res.status(500).json({ message: "Error in Signup" });
    console.log(error);
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp === otp) {
      await client.user.update({
        where: {
          email,
        },
        data: {
          isVerified: true,
          otp: null,
        },
      });
      return res.json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "OTP is not valid" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await client.user.findUnique({
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    res.json({ message: "Login successfull", token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { signup, verifyOtp, login };
