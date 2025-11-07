import { NextResponse } from 'next/server';
import { mongoConnection } from '../../../../utilities/db_connector';

export async function GET() {
  let client;
  
  try {
    const collection = mongoConnection.collection('learn_categories');

    const categories = await collection.find({}).toArray();
    
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'public, s-maxage=3600',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
