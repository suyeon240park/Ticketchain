'use client'

import { useState, useEffect } from 'react'
import TicketCard from '../../components/TicketCard'
import { Event } from '../../types'
import { useTickets } from '@/hooks/useTickets'
import useEvents from '@/hooks/useEvents'

interface Ticket {
  id: string
  event: Event
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const { buyTickets, showTickets, loading, error } = useTickets();
  const { events, addEvent, editEvent, deleteEvent, getEventById } = useEvents()


  useEffect(() => { 
    const fetchTickets = async () => {
      const userId = '6774288e95ac61d87295c3be'; // Replace with dynamic userId as needed 
      const fetchedTickets = await showTickets(userId); 
      //could also delete tickets here
      if (fetchedTickets) { 
        const ticketsWithEvents = await Promise.all(
          fetchedTickets.map(async (ticket) => {
            const event = await getEventById(ticket.eventId);
            if (event) {
              return { id: ticket.id, event };
            }
            return null;
          })
        );
        const filteredTickets = ticketsWithEvents.filter(ticket => ticket !== null);
        setTickets(filteredTickets);
      }
    }; 
    fetchTickets(); 
  }, [showTickets, getEventById]);

  //replace with the message or what u want to give to organizer to verify message
  const qrMessage = "testing qrmessag";
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Tickets</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} event={ticket.event} ticketId={ticket.id} qr_message={qrMessage} />
        ))}
      </div>
    </main>
  )
}

