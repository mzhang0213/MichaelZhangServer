import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let theClient: MongoClient;
let client: Promise<MongoClient>;

declare global {
    let _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env');
}

/*
if (process.env.NODE_ENV === 'development') {
    // In dev, use global to preserve value across hot reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
}
 */

theClient = new MongoClient(uri, options);
client = theClient.connect();

export default client;
