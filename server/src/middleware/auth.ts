import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth";
import User from "../models/user.model";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // @ts-ignore
    req.user = user;
    return next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
