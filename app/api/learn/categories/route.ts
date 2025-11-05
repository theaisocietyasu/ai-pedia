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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Optional Description 
    const categoryDescription = description?.trim() || '';

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

    // Create new category
    const newCategory = {
      name: name.trim(),
      description: categoryDescription,
      createdAt: new Date()
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
