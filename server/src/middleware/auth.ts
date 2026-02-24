import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      // @ts-ignore
      req.user = session.user;
      return next();
    }
  } catch (error) {
    console.error("Auth error:", error);
  }

  res.status(401).json({ error: "Unauthorized" });
};
