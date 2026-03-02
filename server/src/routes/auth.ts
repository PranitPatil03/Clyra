import express from "express";
import bcrypt from "bcryptjs";
import { isAuthenticated } from "../middleware/auth";
import { signToken, getCookieOptions } from "../lib/auth";
import User from "../models/user.model";

const router = express.Router();

// ─── Current user ────────────────────────────────────────────────────────────
router.get("/current-user", isAuthenticated, (req, res) => {
  const user = req.user as any;
  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    image: user.image,
    isPremium: user.isPremium,
  });
});

// ─── Email / Password Registration ──────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash });

    const token = signToken({ userId: String(user._id), email: user.email });
    res.cookie("token", token, getCookieOptions());

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── Email / Password Login ─────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ userId: String(user._id), email: user.email });
    res.cookie("token", token, getCookieOptions());

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── Logout ─────────────────────────────────────────────────────────────────
router.get("/logout", (req, res) => {
  res.cookie("token", "", { ...getCookieOptions(), maxAge: 0 });
  res.json({ status: "ok" });
});

// ─── Set session cookie via AJAX (used after Google OAuth redirect) ─────────
router.post("/set-session", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const { verifyToken } = await import("../lib/auth");
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(payload.userId).lean();
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set the cookie via AJAX response (this works cross-origin with withCredentials)
    res.cookie("token", token, getCookieOptions());
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      isPremium: user.isPremium,
    });
  } catch (err) {
    console.error("Set session error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── Google OAuth – Step 1: Redirect to Google ──────────────────────────────
router.get("/google", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = `${process.env.BETTER_AUTH_URL}/auth/google/callback`;
  const scope = encodeURIComponent("openid email profile");
  const state = Math.random().toString(36).substring(2);

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

  res.redirect(url);
});

// ─── Google OAuth – Step 2: Callback ────────────────────────────────────────
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BETTER_AUTH_URL}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error("Google token exchange failed:", tokenData);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=token_exchange`);
    }

    // Get user info
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const profile = await userInfoRes.json();

    if (!profile.email) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_email`);
    }

    // Find or create user
    let user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: profile.email }],
    });

    if (user) {
      // Link Google ID if they registered with email first
      if (!user.googleId) {
        user.googleId = profile.id;
        if (profile.picture) user.image = profile.picture;
        await user.save();
      }
    } else {
      user = await User.create({
        googleId: profile.id,
        email: profile.email,
        name: profile.name || profile.email,
        image: profile.picture,
      });
    }

    const token = signToken({ userId: String(user._id), email: user.email });

    // Redirect to client callback page with token in URL.
    // The client will then set the cookie via AJAX (which works cross-origin).
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server`);
  }
});

export default router;
