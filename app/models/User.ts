import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "organizer"], required: true },
    walletAddress: { type: String, default: "" },
    encryptedPrivateKey: { type: String, default: "" },
  },
  { collection: "users" } // Ensure it looks under userinfo.users
);

export default mongoose.model("User", userSchema);
