import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { auth } from '@clerk/nextjs/server';
import { uploadImageToGridFS } from '@/lib/gridfs';
import { slugifyCategory } from '@/lib/slug';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ml-visualization';
const LEARN_COLLECTION = process.env.LEARN_COLLECTION_NAME || 'learn_content';

export async function POST(request: NextRequest) {
  let client;
  
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to upload content' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const categoriesString = formData.get('categories') as string;
    const actionButtonsString = formData.get('action_buttons') as string;
    const thumbnailFile = formData.get('thumbnail') as File;

    // Validate required fields
    if (!title || !description || !content || !categoriesString || !thumbnailFile) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, content, categories, and thumbnail are required' },
        { status: 400 }
      );
    }

    // Parse categories (accept names or slugs)
    let categories: string[];
    try {
      categories = JSON.parse(categoriesString);
      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error('Categories must be a non-empty array');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid categories format' },
        { status: 400 }
      );
    }

    // Parse action buttons (optional)
    let actionButtons = [];
    if (actionButtonsString) {
      try {
        actionButtons = JSON.parse(actionButtonsString);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid action buttons format' },
          { status: 400 }
        );
      }
    }

    // Validate thumbnail file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(thumbnailFile.type)) {
      return NextResponse.json(
        { error: 'Invalid thumbnail file type. Please upload a JPG, PNG, GIF, or WebP image.' },
        { status: 400 }
      );
    }

    // Upload thumbnail to GridFS
    const arrayBuffer = await thumbnailFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const { fileId, url: thumbnailUrl } = await uploadImageToGridFS(
      buffer,
      thumbnailFile.name,
      thumbnailFile.type,
      userId
    );

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const collection = db.collection(LEARN_COLLECTION);
    const categoriesCollection = db.collection(process.env.CATEGORIES_COLLECTION_NAME || 'learn_categories');

    // Normalize incoming categories to slugs and validate existance
    const normalizedCategorySlugs: string[] = [];
    for (const cat of categories) {
      const slug = slugifyCategory(cat);
      const existing = await categoriesCollection.findOne({
        $or: [
          { name: cat },
          { name: new RegExp(`^${cat}$`, 'i') }
        ]
      });

      // If not found by name, try matching by slug computed from name field
      let valid = existing;
      if (!existing) {
        const bySlug = await categoriesCollection.findOne({
          $expr: {
            $eq: [
              {
                $replaceAll: {
                  input: { $toLower: { $trim: { input: '$name' } } },
                  find: ' ',
                  replacement: '-'
                }
              },
              slug
            ]
          }
        });
        valid = bySlug;
      }

      if (!valid) {
        return NextResponse.json(
          { error: `Unknown category: ${cat}` },
          { status: 400 }
        );
      }
      normalizedCategorySlugs.push(slug);
    }

    // Create the learn module document
    const learnModule = {
      title: title.trim(),
      categories: normalizedCategorySlugs,
      content: content,
      thumbnail: thumbnailUrl,
      description: description.trim(),
      action_buttons: actionButtons,
      createdAt: new Date(),
      createdBy: userId
    };

    // Insert into database
    const result = await collection.insertOne(learnModule);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: 'Learn module uploaded successfully',
      module: {
        ...learnModule,
        _id: result.insertedId
      }
    });

  } catch (error) {
    console.error('Error uploading learn module:', error);
    return NextResponse.json(
      { error: 'Internal server error while uploading learn module' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}