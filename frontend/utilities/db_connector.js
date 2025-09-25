import dotenv from 'dotenv';
// Load dotenv before anything else
const environment = "DEV"

if (environment === "DEV") {
    dotenv.config({path: '.env.local'});
} else {
    dotenv.config();
}

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log("Mongo URI: ", uri);
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