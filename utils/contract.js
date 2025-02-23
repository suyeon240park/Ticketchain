// Interact with the NFT Smart Contract in Next.js
import { ethers } from "ethers";
import TicketNFT from "../ticket-contracts/artifacts/contracts/TicketNFT.sol/TicketNFT.json"; // Adjust path

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = provider.getSigner(0);
const contract = new ethers.Contract(CONTRACT_ADDRESS, TicketNFT.abi, signer);

export { contract };
