import { useState } from 'react';
import useEvents from './useEvents';
import { MongoTicket } from '@/app/types';
export function useTickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { events, addEvent, editEvent, deleteEvent, getEventById } = useEvents()


  // Function to handle buying tickets
  const buyTickets = async (userId: string, cartItems: { event: { id: string }; quantity: number }[]) => {
    const tickets = cartItems.map((item) => ({
      id: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, // Generate unique ticket ID
      eventId: item.event.id, // Event ID as it is
    }));

    try {
      setLoading(true);
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tickets }),
      });

      if (!response.ok) {
        throw new Error('Failed to checkout');
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error during ticket purchase:', error);
      setError('Checkout failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  // Function to show tickets (fetch from database)
  async function showTickets(userId: string): Promise<MongoTicket[] | null> {
    try {
      const response = await fetch(`/api/tickets?userId=${userId}`);
  
      if (!response.ok) {
        console.error(`Failed to fetch tickets for user with ID ${userId}:`, response.statusText);
        return null;
      }
  
      const data = await response.json();
      return data.tickets as MongoTicket[];
    } catch (error) {
      console.error(`Error fetching tickets for user with ID ${userId}:`, error);
      return null;
    }
  }
  

  return { buyTickets, showTickets, loading, error };
}
