import dotenv from 'dotenv';
// Load dotenv before anything else
const environment = "DEV";

if (environment == "DEV") {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config();
}

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set. Please check your .env.local file.");
}
const dbname = process.env.MONGODB_DB_NAME || 'ml_visualization';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbname);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export const mongoConnection = await connectToDatabase();