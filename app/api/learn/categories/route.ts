import { NextResponse } from 'next/server';
import { mongoConnection } from '../../../../utilities/db_connector';

export async function GET() {
  let client;
  
  try {
    const collection = mongoConnection.collection('learn_categories');

    const categories = await collection.find({}).toArray();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
