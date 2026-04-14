import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

// routes
import authRoute from "./routes/auth";
import contractsRoute from "./routes/contracts";
import paymentsRoute from "./routes/payments";
import { handleWebhook } from "./controllers/payment.controller";

const app = express();
app.set("trust proxy", 1);

const PORT = Number(process.env.PORT || 8080);
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const MONGO_CONNECT_RETRIES = Number(process.env.MONGO_CONNECT_RETRIES || 5);
const MONGO_RETRY_DELAY_MS = Number(process.env.MONGO_RETRY_DELAY_MS || 5000);

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

async function connectToMongoWithRetry() {
  if (!MONGODB_URI) {
    throw new Error("Missing MongoDB URI env var (MONGODB_URI or MONGO_URI)");
  }

  // Prevent silent query buffering when Mongo is unavailable.
  mongoose.set("bufferCommands", false);

  for (let attempt = 1; attempt <= MONGO_CONNECT_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });

      console.log(`Connected to MongoDB (attempt ${attempt})`);
      return;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown connection error";

      console.error(
        `MongoDB connection failed (attempt ${attempt}/${MONGO_CONNECT_RETRIES}): ${message}`
      );

      if (attempt === MONGO_CONNECT_RETRIES) {
        throw error;
      }

      await sleep(MONGO_RETRY_DELAY_MS);
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

app.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(express.json());

app.use("/auth", authRoute);
app.use("/contracts", contractsRoute);
app.use("/payments", paymentsRoute);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "OK",
    mongoState: mongoose.connection.readyState,
  });
});

async function bootstrap() {
  try {
    await connectToMongoWithRetry();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void bootstrap();
