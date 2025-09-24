import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('ml_visualization');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export const mongoConnection = connectToDatabase();