import { NextResponse } from 'next/server';
import { mongoConnection } from '@/utilities/db_connector';
import { auth, clerkClient } from '@clerk/nextjs/server';

const LOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const HEARTBEAT_INTERVAL_MS = 30 * 1000; // 30 seconds

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const collection = mongoConnection.collection('learn_content_locks');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOCK_DURATION_MS);

    // Get user info for display
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'Unknown Officer';

    // Try to acquire or refresh lock
    const result = await collection.findOneAndUpdate(
      {
        slug: slug,
        $or: [
          { userId: userId }, // Current user already has the lock
          { expiresAt: { $lt: now } }, // Lock has expired
          { userId: { $exists: false } } // No lock exists
        ]
      },
      {
        $set: {
          slug: slug,
          userId: userId,
          userName: userName,
          acquiredAt: now,
          expiresAt: expiresAt,
          lastHeartbeat: now
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );

    if (!result) {
      // Lock is held by someone else
      const existingLock = await collection.findOne({ slug: slug });

      return NextResponse.json(
        {
          locked: true,
          lockedBy: existingLock?.userName || 'Another officer',
          lockedByUserId: existingLock?.userId,
          expiresAt: existingLock?.expiresAt,
          error: 'Content is currently being edited by another officer'
        },
        { status: 423 } // 423 Locked
      );
    }

    return NextResponse.json({
      success: true,
      locked: false,
      lockAcquired: true,
      expiresAt: expiresAt,
      heartbeatInterval: HEARTBEAT_INTERVAL_MS
    });

  } catch (error) {
    console.error('Error acquiring lock:', error);
    return NextResponse.json(
      { error: 'Internal server error while acquiring lock' },
      { status: 500 }
    );
  }
}

// Check lock status
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const collection = mongoConnection.collection('learn_content_locks');
    const now = new Date();

    // Find active lock
    const lock = await collection.findOne({
      slug: slug,
      expiresAt: { $gt: now }
    });

    if (lock) {
      return NextResponse.json({
        locked: true,
        lockedBy: lock.userName,
        lockedByUserId: lock.userId,
        expiresAt: lock.expiresAt,
        lastHeartbeat: lock.lastHeartbeat
      });
    }

    return NextResponse.json({
      locked: false
    });

  } catch (error) {
    console.error('Error checking lock status:', error);
    return NextResponse.json(
      { error: 'Internal server error while checking lock' },
      { status: 500 }
    );
  }
}

// Release lock
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const collection = mongoConnection.collection('learn_content_locks');

    // Delete lock only if owned by current user
    const result = await collection.deleteOne({
      slug: slug,
      userId: userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'No lock found or you do not own this lock' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lock released successfully'
    });

  } catch (error) {
    console.error('Error releasing lock:', error);
    return NextResponse.json(
      { error: 'Internal server error while releasing lock' },
      { status: 500 }
    );
  }
}

// Heartbeat to keep lock alive
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const collection = mongoConnection.collection('learn_content_locks');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOCK_DURATION_MS);

    // Update heartbeat and extend expiration
    const result = await collection.updateOne(
      {
        slug: slug,
        userId: userId
      },
      {
        $set: {
          lastHeartbeat: now,
          expiresAt: expiresAt
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Lock not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      expiresAt: expiresAt
    });

  } catch (error) {
    console.error('Error updating heartbeat:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating heartbeat' },
      { status: 500 }
    );
  }
}
