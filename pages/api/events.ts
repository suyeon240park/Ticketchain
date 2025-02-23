import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('eventinfo');
  const collection = db.collection('events');

  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        const event = await collection.findOne({ _id: new ObjectId(req.query.id as string) });
        if (event) {
          res.status(200).json({
            id: event._id.toString(),
            name: event.name,
            date: event.date,
            price: event.price,
            location: event.location,
            maxPriceCap: event.maxPriceCap
          });
        } else {
          res.status(404).json({ message: 'Event not found' });
        }
      } else {
        const events = await collection.find({}).toArray();
        // Transform MongoDB documents to Event type.
        const transformedEvents = events.map(event => ({
          id: event._id.toString(),
          name: event.name,
          date: event.date,
          price: event.price,
          location: event.location,
          maxPriceCap: event.maxPriceCap
        }));
        res.status(200).json(transformedEvents);
      }
      break;
    
    case 'POST':
      const newEvent = req.body;
      const result = await collection.insertOne(newEvent);
      res.status(201).json({ ...newEvent, id: result.insertedId.toString() });
      break;
    case 'PUT':
      const { id, ...updatedEvent } = req.body;
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedEvent });
      res.status(200).json({ ...updatedEvent, id });
      break;
    case 'DELETE':
      const { id: deleteId } = req.body;
      await collection.deleteOne({ _id: new ObjectId(deleteId) });
      res.status(204).end();
      break;
    default:
      res.status(405).end();
      break;
  }
};

export default handler;
