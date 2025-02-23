import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { Event, UserTickets, MongoTicket } from '../../app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('userinfo');
    const ticketsCollection = db.collection<UserTickets>('tickets');

    if (req.method === 'POST') {
      const { userId, tickets } = req.body;

      if (!userId || !tickets || !Array.isArray(tickets)) {
        return res.status(400).json({ error: 'Invalid data. Must include userId and tickets array.' });
      }

      // Format tickets to match MongoDB schema
      const formattedTickets: MongoTicket[] = tickets.map((ticket: { id: string; eventId: string }) => ({
        id: ticket.id,
        eventId: ticket.eventId,
      }));

      // Update or insert user tickets
      const result = await ticketsCollection.updateOne(
        { _id: userId },
        { $push: { tickets: { $each: formattedTickets } } },
        { upsert: true }
      );

      res.status(200).json({ success: true, result });
    } else if (req.method === 'GET') {
      try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ error: 'Invalid userId.' });
        }

        // Fetch tickets for the user
        const userTickets = await ticketsCollection.findOne({ _id: userId });

        if (!userTickets) {
          return res.status(404).json({ error: 'No tickets found for this user.' });
        }

        res.status(200).json({ tickets: userTickets.tickets });
      } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('Error handling tickets:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
