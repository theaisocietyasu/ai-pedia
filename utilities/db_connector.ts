import dotenv from 'dotenv';
// Load dotenv before anything else
const environment = "DEV";

if (environment == "DEV") {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config();
}

import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set. Please check your .env.local file.");
}
const dbname = process.env.MONGODB_DB_NAME || 'ml_visualization';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionPromise: Promise<Db> | null = null;

async function connectToDatabase(): Promise<Db> {
    try {
        if (!client) {
            client = new MongoClient(uri as string, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
            });
            await client.connect();
            console.log('✅ Connected to MongoDB successfully');
        }
        db = client.db(dbname);
        return db;
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error instanceof Error ? error.message : String(error));
        client = null;
        db = null;
        connectionPromise = null;
        throw error;
    }
}

async function getConnection(): Promise<Db> {
    if (db) {
        return db;
    }

    if (!connectionPromise) {
        connectionPromise = connectToDatabase();
    }

    return connectionPromise;
}

// Create wrapper object with proper async methods
export const mongoConnection = {
    collection: async (name: string): Promise<Collection> => {
        const connection = await getConnection();
        return connection.collection(name);
    },
    db: async (): Promise<Db> => {
        return getConnection();
    },
    client: async (): Promise<MongoClient> => {
        if (!client) {
            await getConnection();
        }
        return client!;
    }
};

// Also export the direct connection getter for backwards compatibility
export { getConnection };