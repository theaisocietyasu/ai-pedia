import { NextResponse } from 'next/server';
import { mongoConnection } from '../../../../../utilities/db_connector';
import { slugifyCategory } from '@/lib/slug';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ml-visualization';
const LEARN_COLLECTION = process.env.LEARN_COLLECTION_NAME || 'learn_content';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  let client;
  
  try {
  const { category } = await params;

    const collection = mongoConnection.collection('learn_content');
    const categoriesCollection = mongoConnection.collection('learn_categories');

    // Resolve the canonical category name from the slug
    const slug = slugifyCategory(category);
    const categoryDoc = await categoriesCollection.findOne({
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
    const legacyName = categoryDoc?.name;

    // Query by current format (slug) OR legacy format (stored full name)
    const modules = await collection.find({
      $or: [
        { categories: { $in: [slug] } },
        ...(legacyName ? [{ categories: { $in: [legacyName] } }] : [])
      ]
    }).toArray();
    
    // Transform to match expected format
    const filteredContent = modules.map(item => ({
      _id: item._id,
      title: item.title,
      categories: item.categories,
      thumbnail: item.thumbnail,
      description: item.description || ''
    }));
    
    return NextResponse.json(filteredContent);
  } catch (error) {
    console.error('Error fetching modules by category:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
