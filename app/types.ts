import { ObjectId } from "mongodb";

export interface Event {
  id: string
  name: string
  date: string
  price: number
  maxResaleCap: number
  location: string
}

// Interface for frontend use
export interface Ticket {
  tokenURI: string;
  event: Event;
}

export interface User {
  _id: ObjectId | string;
  tickets: Ticket[];
}

export interface UserTickets {
  _id: ObjectId; // token URI
  tickets: MongoTicket[]; // A list of tickets stored in MongoDB schema
}

export interface MongoTicket {
  tokenURI: string;
  eventId: string;
}

