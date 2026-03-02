import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustHost: process.env.NODE_ENV === "production",
    database: mongodbAdapter(client.db()),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    trustedOrigins: [process.env.CLIENT_URL as string],
    advanced: {
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        },
        trustedProxyHeaders: true,
    },
});
