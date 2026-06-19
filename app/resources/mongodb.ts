import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
}

// Cache the connected client on globalThis so that Next.js hot-reloads (and
// concurrent requests / multiple browser instances) reuse ONE pooled client
// instead of spawning a new MongoClient each time — which would exhaust the
// Atlas connection limit and crash the backend. The MongoDB driver pools
// connections internally, so this single client safely handles simultaneous
// requests. Never call .close() on it.
const globalForMongo = globalThis as unknown as {
    _mongoClientPromise?: Promise<MongoClient>;
};

const client: Promise<MongoClient> =
    globalForMongo._mongoClientPromise ?? new MongoClient(uri).connect();

if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = client;
}

export default client;
