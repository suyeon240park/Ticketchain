import { ethers } from "ethers";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "../../app/models/User";
import crypto from "crypto";

dotenv.config({ path: __dirname + "/../.env" });

const MONGO_URI = process.env.MONGO_URI as string;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

function encryptPrivateKey(privateKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Store IV + Encrypted Data
}

async function createWalletForUser(username: string) {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "userinfo" });

    const user = await UserModel.findOne({ username });
    if (!user) {
      console.error(`User ${username} not found.`);
      return;
    }

    // Generate a new wallet
    const wallet = ethers.Wallet.createRandom();
    console.log(`Wallet private key: ${wallet.privateKey}`);
    const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

    // Update user with wallet info
    user.walletAddress = wallet.address;
    user.encryptedPrivateKey = encryptedPrivateKey;
    await user.save();

    console.log(`Wallet created for ${username}`);
    console.log(`Address: ${wallet.address}`);
  } catch (error) {
    console.error("Error creating wallet:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run for demo users
(async () => {
  await createWalletForUser("customer_demo");
  await createWalletForUser("organizer_demo");
})();
