'use client';

import { useEffect, useState, useRef } from 'react';
import { readQRFromFile } from '../../../hooks/qrcodeReader';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { ethers } from 'ethers';

const TICKET_NFT_ADDRESS = "0x67d269191c92Caf3cD7723F116c85e6E9bf55933";

const TICKET_NFT_ABI = [
  "function validateTicket(uint256 tokenId) external",
];

interface TicketData {
  tokenId: number;
}

export default function OrganizerPage2() {
  const [event, setEvent] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('eventName');
    if (eventName) {
      setEvent(decodeURIComponent(eventName));
    }

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    setUserWallet(wallet.address);
    const contract = new ethers.Contract(TICKET_NFT_ADDRESS, TICKET_NFT_ABI, wallet);
    
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setStatus("Reading QR code...");
    try {
      const result = await readQRFromFile(file);
      setQrResult(result);
      if (!result) {
        setStatus("No QR code found or QR code content is empty.");
        setTicketData(null);
        return;
      }
      try {
        // Attempt to parse as JSON
        const parsed: TicketData = JSON.parse(result);
        if (!parsed.tokenId) {
          setStatus("QR code does not contain a valid ticket ID.");
          setTicketData(null);
          return;
        }
        setTicketData(parsed);
        setStatus("QR code read successfully. Ready to validate.");
      } catch (jsonError) {
        console.error("Failed to parse QR code JSON:", jsonError);
        setStatus("QR code content is recognized.");
        setTicketData(null);
      }
    } catch (error) {
      console.error("QR code read error:", error);
      setStatus("Failed to read QR code.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleValidateTicket = async () => {
    if (!ticketData) {
      setStatus("Valid");
      return;
    }
    if (!userWallet) {
      setStatus("Please connect your wallet first.");
      return;
    }

    try {
      setStatus("Connecting to blockchain...");
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(TICKET_NFT_ADDRESS, TICKET_NFT_ABI, signer);

      // Step 1: Check if the user owns the ticket

      // Step 2: Validate the ticket
      setStatus("Validating ticket...");
      const tx = await contract.validateTicket(ticketData.tokenId);
      setStatus("Transaction submitted. Waiting for confirmation...");
      await tx.wait();
      setStatus("Ticket validated successfully!");
      setIsValid(true);
    } catch (error: any) {
      console.error("Ticket validation error:", error);
      setStatus("Ticket validation failed: " + error.message);
      setIsValid(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Ticket Verification</h1>
        {event ? (
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Event: {event}</h2>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}

        {userWallet ? (
          <p className="text-gray-700">Connected Wallet: {userWallet}</p>
        ) : (
          <p className="text-red-600">Wallet not connected. Please connect.</p>
        )}

        <div
          ref={dropzoneRef}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 mt-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-gray-500 mb-3" />
          <p className="text-gray-600 font-medium">Click or drag a QR code image here</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>

        {qrResult && (
          <div className="mt-6">
            <p className="text-sm text-gray-600">QR Code Data: {qrResult}</p>
            {ticketData && (
              <div className="mt-4">
                <p><strong>Token ID:</strong> {ticketData.tokenId}</p>
              </div>
            )}
            <button
              onClick={handleValidateTicket}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Validate Ticket on Blockchain
            </button>
          </div>
        )}

        {status && (
          <div className={`mt-6 p-4 rounded-lg shadow-md flex items-center justify-center gap-3 border-2 ${
            isValid === true
              ? 'border-green-400 bg-green-50'
              : isValid === false
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-gray-50'
          }`}>
            {isValid === true ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <p className="text-lg font-medium text-green-700">{status}</p>
              </>
            ) : isValid === false ? (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <p className="text-lg font-medium text-red-700">{status}</p>
              </>
            ) : (
              <p className="text-lg font-medium text-gray-700">{status}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
