import { useState, useCallback } from 'react';
import useEvents from './useEvents';
import { MongoTicket } from '../app/types';

export function useTickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getEventById } = useEvents();

  const buyTickets = async (userId: string, cartItems: { event: { id: string }; quantity: number }[]) => {
    try {
      setLoading(true);
      if (!userId) throw new Error('User ID is missing');
      if (cartItems.length === 0) throw new Error('Cart is empty');

      for (const item of cartItems) {
        for (let i = 0; i < item.quantity; i++) {
          const response = await fetch('/api/buyTicket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, eventId: item.event.id }),
          });
          if (!response.ok) {
            throw new Error(`Failed to checkout ticket for event ${item.event.id}`);
          }
        }
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

  const showTickets = useCallback(async (userId: string): Promise<MongoTicket[] | null> => {
    try {
      const response = await fetch(`/api/showTicket?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      return data.tickets as MongoTicket[];
    } catch (error) {
      console.error(`Error fetching tickets for user with ID ${userId}:`, error);
      return null;
    }
  }, []);

  return { buyTickets, showTickets, loading, error };
}
