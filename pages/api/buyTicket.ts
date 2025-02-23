import { NextApiRequest, NextApiResponse } from "next";
import { ethers, Contract, JsonRpcProvider } from "ethers";
import TicketNFTArtifact from "../../ticket-contracts/artifacts/contracts/TicketNFT.sol/TicketNFT.json";
import clientPromise from "../../lib/mongodb";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }

    const { userId, eventId } = req.body;
    
    // Step 1: Validate Input Data
    if (!userId || !eventId) {
      console.error("Error: Missing userId or eventId.");
      return res.status(400).json({ error: "Invalid request. userId and eventId are required." });
    }
    console.log(`Received userId: ${userId}, eventId: ${eventId}`);

    // Step 2: Validate Environment Variables
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const organizerPrivateKey = process.env.ORGANIZER_PRIVATE_KEY;
    const customerPrivateKey = process.env.CUSTOMER_PRIVATE_KEY;
    if (!contractAddress || !organizerPrivateKey || !customerPrivateKey) {
      console.error("Error: Missing blockchain environment variables.");
      return res.status(500).json({ error: "Blockchain configuration error. Required keys are missing." });
    }

    // Step 3: Connect to MongoDB
    let client;
    try {
      client = await clientPromise;
    } catch (err) {
      console.error("MongoDB connection failed:", err);
      return res.status(500).json({ error: "Database connection error." });
    }
    const eventDb = client.db("eventinfo");
    const eventsCollection = eventDb.collection("events");
    const userDb = client.db("userinfo");
    const ticketsCollection = userDb.collection("tickets");

    // Step 4: Fetch Event Details
    const eventInfo = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    if (!eventInfo) {
      return res.status(404).json({ error: `Event with ID ${eventId} not found.` });
    }
    console.log("Event details:", eventInfo);

    // Step 5: Connect to Blockchain
    let provider, organizerWallet, customerWallet, ticketContract;
    try {
      provider = new JsonRpcProvider("http://localhost:8545");
      organizerWallet = new ethers.Wallet(organizerPrivateKey, provider);
      customerWallet = new ethers.Wallet(customerPrivateKey, provider);
      ticketContract = new Contract(contractAddress, TicketNFTArtifact.abi, organizerWallet);
    } catch (err) {
      console.error("Blockchain connection failed:", err);
      return res.status(500).json({ error: "Failed to connect to blockchain." });
    }

    // Step 6: Convert Prices to ETH
    let ticketPriceInEth, maxResalePriceInEth;
    try {
      // In this example, we convert using a divisor (e.g. 2000). Adjust as needed.
      ticketPriceInEth = ethers.parseEther((eventInfo.price / 2000).toString());
      maxResalePriceInEth = ethers.parseEther((eventInfo.maxResaleCap / 2000).toString());
    } catch (err) {
      console.error("Price conversion failed:", err);
      return res.status(500).json({ error: "Error converting prices to ETH." });
    }

    // Step 7: Mint NFT Ticket
    console.log("Minting NFT Ticket...");
    const tokenURI = ethers.keccak256(ethers.toUtf8Bytes(eventId));
    let mintReceipt;
    try {
      const mintTx = await ticketContract.mintTicket(customerWallet.address, tokenURI, maxResalePriceInEth);
      mintReceipt = await mintTx.wait();
      if (!mintReceipt || !mintReceipt.hash) {
        throw new Error("NFT Minting failed. No transaction hash returned.");
      }
      console.log(`NFT Minted! Transaction Hash: ${mintReceipt.hash}`);
    } catch (err) {
      console.error("Minting failed:", err);
      return res.status(500).json({ error: "Blockchain minting transaction failed." });
    }

    // Step 8: Process Payment Transaction
    console.log("Processing payment transaction...");
    let paymentReceipt;
    try {
      const paymentTx = await customerWallet.sendTransaction({
        to: organizerWallet.address,
        value: ticketPriceInEth,
      });
      console.log("Waiting for payment transaction confirmation...");
      paymentReceipt = await paymentTx.wait();
      if (!paymentReceipt || !paymentReceipt.hash) {
        throw new Error("Payment transaction failed. No transaction hash returned.");
      }
      console.log(`Payment Successful! Transaction Hash: ${paymentReceipt.hash}`);
    } catch (err) {
      console.error("Payment failed:", err);
      return res.status(500).json({ error: "Payment transfer failed." });
    }

    // Step 9: Store Ticket in MongoDB
    const mongoTicket = {
      tokenURI: tokenURI,
      eventId: eventId,
    };
    
    try {
      const userObjectId = new ObjectId(userId); // Convert if necessary
      const existingUser = await ticketsCollection.findOne({ _id: userObjectId });
    
      if (!existingUser) {
        return res.status(500).json({ error: `Customer with ${userId} doesn't exist in DB.` });
      }
    
      // Update query with correct type
      const result = await ticketsCollection.updateOne(
        { _id: userObjectId },
        { $push: { tickets: mongoTicket as any } },
        { upsert: true }
      );
    
      res.status(200).json({ success: true, result });
    } catch (err) {
      console.error("MongoDB ticket storage failed:", err);
      return res.status(500).json({ error: "Failed to store ticket in database." });
    }

    return res.status(200).json({ 
      success: true, 
      tokenURI, 
      mintTransactionHash: mintReceipt.hash, 
      paymentTransactionHash: paymentReceipt.hash 
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

