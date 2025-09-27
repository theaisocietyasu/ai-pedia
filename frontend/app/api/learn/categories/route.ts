import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ml-visualization';
const CATEGORIES_COLLECTION = process.env.CATEGORIES_COLLECTION_NAME || 'learn_categories';

export async function GET() {
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection(CATEGORIES_COLLECTION);
    
    const categories = await collection.find({}).toArray();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
