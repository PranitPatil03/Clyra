import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  email: string;
  name: string;
  password?: string;
  image?: string;
  isPremium: boolean;
  premiumSince?: Date;
  premiumEndedAt?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

const UserSchema: Schema = new Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String }, // null for Google-only users
    image: { type: String },
    isPremium: { type: Boolean, default: false },
    premiumSince: { type: Date },
    premiumEndedAt: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
