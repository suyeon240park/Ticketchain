import { ethers } from "ethers";
import TicketNFTABI from "../../ticket-contracts/artifacts/contracts/TicketNFT.sol/TicketNFT.json";
import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const HARDHAT_RPC_URL = "http://127.0.0.1:8545";

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { customerAddress, tokenURI, maxResalePrice } = req.body;

    // Connect to Hardhat local blockchain
    const provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
    const signer = new ethers.Wallet(process.env.ORGANIZER_PRIVATE_KEY!, provider);
    
    // Retrieve deployed contract address
    const contract = new ethers.Contract(CONTRACT_ADDRESS!, TicketNFTABI.abi, signer);

    // Call mintTicket function
    const tx = await contract.mintTicket(customerAddress, tokenURI, maxResalePrice);
    const receipt = await tx.wait();
    
    const event = receipt.logs.find((log: any) => log.event === "TicketMinted");
    if (!event) throw new Error("Minting event not found!");

    const tokenId = event.args.tokenId.toString();
    return res.status(200).json({ success: true, tokenId });

  } catch (error) {
    console.error("Minting Error:", error);
    return res.status(500).json({ error: "Failed to mint NFT" });
  }
}
