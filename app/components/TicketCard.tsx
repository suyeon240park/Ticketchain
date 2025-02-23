'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Event } from '../types'

interface TicketCardProps {
  event: Event
  ticketId: string
  qr_message:string
}

export default function TicketCard({ event, ticketId, qr_message }: TicketCardProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const toggleZoom = () => setIsZoomed(!isZoomed)
  const baseSize = 128;
  const additionalSize = Math.min(qr_message.length * 2, 512); // Adjust as needed
  const qrSize = baseSize + additionalSize;

  return (
    <div className="relative">
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
        <p className="text-gray-600 mb-2">Date: {event.date}</p>
        <p className="text-gray-600 mb-2">Location: {event.location}</p>
        <p className="text-green-600 font-bold mb-4">Ticket ID: {ticketId}</p>
        <div className="flex justify-center">
          <div
            className="cursor-pointer"
            onClick={toggleZoom}
            aria-label={isZoomed ? "Zoom out QR code" : "Zoom in QR code"}
          >
            
            <QRCodeSVG value={qr_message} size={qrSize} />
          </div>
        </div>
        <p className="text-sm text-center mt-2">Click to zoom</p>
      </div>
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          onClick={toggleZoom}
        >
          <div 
            className="bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <QRCodeSVG value={qr_message} size={qrSize} />
            <p className="text-sm text-center mt-2">Click outside to close</p>
          </div>
        </div>
      )}
    </div>
  )
}

