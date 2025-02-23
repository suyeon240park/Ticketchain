import { useState, useEffect } from 'react';
import { Event } from '../app/types';

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const addEvent = async (newEvent: Omit<Event, 'id'>) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });
    const data = await response.json();
    setEvents([...events, data]);
  };

  const editEvent = async (updatedEvent: Event) => {
    const response = await fetch('/api/events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });
    const data = await response.json();
    setEvents(events.map(event => event.id === data.id ? data : event));
  };

  const deleteEvent = async (eventId: string) => {
    await fetch('/api/events', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: eventId }),
    });
    setEvents(events.filter(event => event.id !== eventId));
  };

async function getEventById(eventId: string): Promise<Event | null> {
    try {
      const response = await fetch(`/api/events?id=${eventId}`);
  
      if (!response.ok) {
        console.error(`Failed to fetch event with ID ${eventId}:`, response.statusText);
        return null;
      }
  
      const event = await response.json();
      return {
        id: event._id,
        name: event.name,
        date: event.date,
        price: event.price,
        location: event.location,
      };
    } catch (error) {
      console.error(`Error fetching event with ID ${eventId}:`, error);
      return null;
    }
  };

  return {
    events,
    addEvent,
    editEvent,
    deleteEvent,
    getEventById,
  };
};

export default useEvents;
