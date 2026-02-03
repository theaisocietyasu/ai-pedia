import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithRole } from '@/lib/auth/server';
import connectToDatabase from '@/lib/mongodb';
import { Animation } from '@/models/animation_model';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and Discord role
    const session = await requireAuthWithRole();
    const userId = session.user.discordId;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, config, description, tags } = body;

    // Validate required fields
    if (!name || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: name and config are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Create animation
    const animation = await Animation.create({
      name,
      description: description || '',
      config,
      createdBy: userId,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true
    });

    return NextResponse.json({
      success: true,
      id: `VZ-custom-${animation._id.toString()}`,
      animation: {
        _id: animation._id.toString(),
        name: animation.name,
        description: animation.description,
        createdAt: animation.createdAt
      }
    });
  } catch (error) {
    console.error('Save animation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save animation' },
      { status: 500 }
    );
  }
}

