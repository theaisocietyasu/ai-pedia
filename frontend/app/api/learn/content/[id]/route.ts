import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ml-visualization';
const LEARN_COLLECTION = process.env.LEARN_COLLECTION_NAME || 'learn_content';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection(LEARN_COLLECTION);
    
    const content = await collection.findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
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
