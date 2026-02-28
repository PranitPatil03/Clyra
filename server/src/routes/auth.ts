import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

const router = express.Router();

router.get("/current-user", isAuthenticated, (req, res) => {
  res.json(req.user);
});

router.get("/logout", async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session) {
      await auth.api.signOut({
        headers: fromNodeHeaders(req.headers),
      });
    }
    res.status(200).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
});

router.get("/google", async (req, res) => {
  try {
    const response = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: `${process.env.CLIENT_URL}/dashboard`,
      },
      asResponse: true,
      headers: fromNodeHeaders(req.headers),
    });

    // Forward Set-Cookie headers from Better Auth to the browser
    const setCookies = response.headers.getSetCookie();
    for (const cookie of setCookies) {
      res.append("Set-Cookie", cookie);
    }

    // Parse the response body to get the Google redirect URL
    const body = await response.json();
    res.redirect(body.url || `${process.env.CLIENT_URL}/login`);
  } catch (err) {
    console.error("Google sign-in error:", err);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
});

export default router;
