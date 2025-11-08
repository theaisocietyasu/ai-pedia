import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { mongoConnection } from '../../../../utilities/db_connector';
import { uploadImageToGridFS } from '@/lib/gridfs';

export async function GET() {
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

export async function POST(request: Request) {
  try {
    // Authenticate user with Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to create categories' },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'Anonymous';

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Category description is required' },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Category image is required' },
        { status: 400 }
      );
    }

    // Validate image file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Please upload JPG, PNG, GIF, or WebP' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    const collection = mongoConnection.collection('learn_categories');

    // Check if category already exists
    const existingCategory = await collection.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to GridFS
    const { fileId, url: imageUrl } = await uploadImageToGridFS(
      buffer,
      image.name,
      image.type,
      userId,
      userName
    );

    // Create new category
    const newCategory = {
      name: name.trim(),
      description: description.trim(),
      image: imageUrl,
      imageId: fileId,
      createdAt: new Date(),
      createdBy: {
        id: userId,
        name: userName
      }
    };

    const result = await collection.insertOne(newCategory);

    return NextResponse.json(
      {
        success: true,
        category: {
          _id: result.insertedId,
          ...newCategory
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
