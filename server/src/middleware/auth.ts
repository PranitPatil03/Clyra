import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("CORS check reached isAuthenticated!");
  console.log("Headers cookie:", req.headers.cookie);
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      // @ts-ignore
      req.user = session.user;
      return next();
    }
    console.log("No session found in better-auth. session variable:", session);
  } catch (error) {
    console.error("Auth error:", error);
  }

  res.status(401).json({ error: "Unauthorized" });
};
