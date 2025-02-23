'use client'

import { useState } from 'react'
import TicketSelector from './TicketSelector'
import { Event } from '../types'

interface EventCardProps {
  event: Event
  isOrganizer?: boolean
  onAddToCart?: (event: Event, quantity: number) => void
}

export default function EventCard({ event, isOrganizer = false, onAddToCart }: EventCardProps) {
  const [ticketCount, setTicketCount] = useState(0)

  const handleTicketChange = (count: number) => {
    setTicketCount(count)
  }

  const handleAddToCart = () => {
    if (ticketCount > 0 && onAddToCart) {
      onAddToCart(event, ticketCount)
      setTicketCount(0)
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
      <p className="text-gray-600 mb-2">Date: {event.date}</p>
      <p className="text-gray-600 mb-2">Location: {event.location}</p>
      <p className="text-green-600 font-bold mb-4">Price: ${event.price}</p>
      {isOrganizer ? (
        <div className="flex justify-end space-x-2">
                    <a
                        href={`/organizer/page2?eventName=${encodeURIComponent(event.name)}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Verify Event Ticket
                    </a>
        </div>
      ) : (
        <>
          <TicketSelector onChange={handleTicketChange} value={ticketCount} />
          <button
            onClick={handleAddToCart}
            disabled={ticketCount === 0}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            Add to Cart
          </button>
        </>
      )}
    </div>
  )
}

