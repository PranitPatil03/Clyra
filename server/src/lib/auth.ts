import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
    userId: string;
    email: string;
}

export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Cookie options for the current environment.
 * Production (cross-origin: vercel ↔ railway) → SameSite=None + Secure
 * Development (localhost) → SameSite=Lax
 */
export function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
    };
}
