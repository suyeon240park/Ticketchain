export interface Event {
  id: string
  name: string
  date: string
  price: number
  location: string
}

export interface Ticket {
  id: string
  event: Event
}

// Interface for MongoDB schema
export interface MongoTicket {
  id: string; // Ticket ID
  eventId: string; 
}

export interface UserTickets {
  _id: string; // User ID
  tickets: MongoTicket[]; // Tickets stored in MongoDB schema
}
