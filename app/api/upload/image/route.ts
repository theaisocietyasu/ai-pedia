import { NextRequest, NextResponse } from 'next/server';
import { requireAuthWithRole } from '@/lib/auth/server';
import { uploadImageToGridFS } from '@/lib/gridfs';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    // Authenticate user and verify Discord role
    const session = await requireAuthWithRole();
    const userId = session.user.discordId;
    const userName = session.user.name || session.user.email || 'Anonymous';

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to GridFS
    const { fileId, url } = await uploadImageToGridFS(
      buffer,
      file.name,
      file.type,
      userId,
      userName
    );

    return NextResponse.json({
      success: true,
      imageId: fileId,
      url,
      author: {
        id: userId,
        name: userName,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error while uploading image' },
      { status: 500 }
    );
  }
}
