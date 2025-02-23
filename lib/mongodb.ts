import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = { ssl: true };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend globalThis properly
declare global {
  // Use `var` instead of `let` for global variables
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }
}

// Ensure we're using the same connection in development
if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // Create a new client for production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
