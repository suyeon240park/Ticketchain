"use client";

import { useState, useEffect } from 'react';
import TicketCard from '../../components/TicketCard';
import { Event } from '../../types';
import { useTickets } from '../../../hooks/useTickets';
import useEvents from '../../../hooks/useEvents';

interface Ticket {
  tokenURI: string;
  event: Event;
  ticketId: string;
}

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { showTickets } = useTickets();
  const { getEventById } = useEvents();

  useEffect(() => { 
    const fetchTickets = async () => {
      const userId = '67b6c218325907d43b7210d5'; // Replace with dynamic userId as needed 
      const fetchedTickets = await showTickets(userId); 
      
      if (fetchedTickets) { 
        const ticketsWithEvents = await Promise.all(
          fetchedTickets.map(async (ticket) => {
            const event = await getEventById(ticket.eventId);
            if (event) {
              return { 
                tokenURI: ticket.tokenURI, 
                event,
                ticketId: `TICKET-${ticket.tokenURI.slice(2, 8).toUpperCase()}` 
              };
            }
            return null;
          })
        );

        const filteredTickets = ticketsWithEvents.filter(ticket => ticket !== null) as Ticket[];
        setTickets(filteredTickets);
      }
    }; 
    fetchTickets(); 
  }, [showTickets, getEventById]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Tickets</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.tokenURI} 
            event={ticket.event} 
            ticketId={ticket.ticketId} 
            qr_message={ticket.tokenURI} 
          />
        ))}
      </div>
    </main>
  );
}
