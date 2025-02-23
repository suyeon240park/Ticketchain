// pages/api/showTicket.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const client = await clientPromise;
    const ticketsDb = client.db('userinfo');
    const eventsDb = client.db('eventinfo');
    
    const ticketsCollection = ticketsDb.collection('tickets');
    const eventsCollection = eventsDb.collection('events');

    // First, get user's tickets
    const userTickets = await ticketsCollection.findOne({ 
      _id: new ObjectId(userId) 
    });

    if (!userTickets || !userTickets.tickets) {
      return res.status(200).json({ tickets: [] });
    }

    // Get event details for each ticket
    const ticketsWithEvents = await Promise.all(
      userTickets.tickets.map(async (ticket: any) => {
        const event = await eventsCollection.findOne({ 
          _id: new ObjectId(ticket.eventId) 
        });
        
        return {
          ...ticket,
          event: event ? {
            id: event._id.toString(),
            name: event.name,
            date: event.date,
            price: event.price,
            location: event.location,
            maxPriceCap: event.maxPriceCap
          } : null
        };
      })
    );

    return res.status(200).json({ 
      tickets: ticketsWithEvents 
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}
