import { type Collection, type Db, MongoClient } from "mongodb";

const dbname = process.env.MONGODB_DB_NAME || "ml_visualization";

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionPromise: Promise<Db> | null = null;

async function connectToDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
      });
      await client.connect();
      console.log("Connected to MongoDB");
    }
    db = client.db(dbname);
    return db;
  } catch (error) {
    console.error(
      "Error connecting to MongoDB:",
      error instanceof Error ? error.message : String(error),
    );
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

// Lazy singleton over the raw MongoDB driver (used by the learn/* APIs and GridFS)
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
    if (!client) {
      throw new Error("MongoDB client failed to initialize.");
    }
    return client;
  },
};

export { getConnection };
