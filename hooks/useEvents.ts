import { useState, useEffect, useCallback } from 'react';
import { Event } from '../app/types';

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events', { method: 'GET' });
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const addEvent = async (newEvent: Omit<Event, 'id'>) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });
    const data = await response.json();
    setEvents([...events, data]);
  };

  const editEvent = async (updatedEvent: Event) => {
    const response = await fetch(`/api/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });
    const data = await response.json();
    setEvents(events.map((event) => (event.id === data.id ? data : event)));
  };

  const deleteEvent = async (eventId: string) => {
    await fetch(`/api/events/${eventId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const getEventById = useCallback(async (eventId: string): Promise<Event | null> => {
    try {
      const response = await fetch(`/api/events?id=${eventId}`, { method: 'GET' });
      if (!response.ok) {
        console.error(`Failed to fetch event with ID ${eventId}:`, response.statusText);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      return null;
    }
  }, []);

  return { events, addEvent, editEvent, deleteEvent, getEventById };
};

export default useEvents;
