'use client';

import { useEffect, useState, useRef } from 'react';
import { readQRFromFile } from '../../../hooks/qrcodeReader'; // Utility function for QR scanning
import { Upload, CheckCircle, XCircle } from 'lucide-react';

export default function OrganizerPage2() {
    const [event, setEvent] = useState<string | null>(null);
    const [qrResult, setQrResult] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);

    const requied_message = "testing qrmessag"; // Required QR message, replace this with what ur supposed to get from the message

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventName = urlParams.get('eventName');
        if (eventName) {
            setEvent(decodeURIComponent(eventName));
        }
    }, []);

    const handleFileUpload = async (file: File) => {
        if (!file) return;
        const result = await readQRFromFile(file);
        setQrResult(result);
        setIsValid(result === requied_message);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (dropzoneRef.current) {
            dropzoneRef.current.classList.add("border-blue-400", "bg-blue-50");
        }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (dropzoneRef.current) {
            dropzoneRef.current.classList.remove("border-blue-400", "bg-blue-50");
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (dropzoneRef.current) {
            dropzoneRef.current.classList.remove("border-blue-400", "bg-blue-50");
        }

        const file = event.dataTransfer.files[0];
        if (file) handleFileUpload(file);
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

                {/* File Upload Box (Drag & Drop Enabled) */}
                <div 
                    ref={dropzoneRef}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 mt-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition w-full"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
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

                {/* Display QR Code Result */}
                {qrResult && (
                    <div className={`mt-6 p-4 rounded-lg shadow-md flex items-center justify-center gap-3 
                        border-2 ${isValid ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                        
                        {isValid ? (
                            <>
                                <CheckCircle className="h-6 w-6 text-green-500" />
                                <p className="text-lg font-medium text-green-700">Valid Ticket</p>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-6 w-6 text-red-500" />
                                <p className="text-lg font-medium text-red-700">
                                    Invalid Ticket.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
