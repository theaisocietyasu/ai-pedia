import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Animation } from '@/models/animation_model';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Extract MongoDB ID from VZ-custom-{id} format
    const mongoId = id.replace('VZ-custom-', '');
    
    // Connect to database
    await connectToDatabase();
    
    const animation = await Animation.findById(mongoId);
    
    if (!animation) {
      return NextResponse.json(
        { error: 'Animation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      _id: animation._id.toString(),
      name: animation.name,
      description: animation.description,
      config: animation.config,
      createdBy: animation.createdBy,
      createdAt: animation.createdAt,
      updatedAt: animation.updatedAt,
      isPublic: animation.isPublic,
      tags: animation.tags || []
    });
  } catch (error) {
    console.error('Fetch animation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch animation' },
      { status: 500 }
    );
  }
}

