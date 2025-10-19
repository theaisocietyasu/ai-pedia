import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { mongoConnection } from '../../../../../utilities/db_connector';

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
    const collection = mongoConnection.collection('learn_content');
    
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
  }
}
