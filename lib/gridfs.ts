import {MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { mongoConnection } from '../utilities/db_connector';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ml-visualization';

// Get MongoDB client and GridFS bucket
async function getGridFSBucket(): Promise<{ client: MongoClient; bucket: GridFSBucket }> {
  const client = mongoConnection.client;
  const db = mongoConnection;
  const bucket = new GridFSBucket(db, { bucketName: 'images' });
  return { client, bucket };
}

// Upload image to GridFS with author metadata
export async function uploadImageToGridFS(
  fileBuffer: Buffer,
  originalFileName: string,
  contentType: string,
  authorId: string,
  authorName?: string
): Promise<{ fileId: string; url: string }> {
  const { client, bucket } = await getGridFSBucket();

  try {
    // Generate unique filename
    const fileExtension = originalFileName.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Create upload stream with metadata
    const uploadStream = bucket.openUploadStream(uniqueFileName, {
      contentType,
      metadata: {
        authorId,
        authorName,
        originalFileName,
        uploadedAt: new Date(),
      },
    });

    // Write file buffer to stream
    await new Promise((resolve, reject) => {
      uploadStream.write(fileBuffer);
      uploadStream.end(() => {
        resolve(uploadStream.id);
      });
      uploadStream.on('error', (error) => {
        reject(error);
      });
    });

    const fileId = uploadStream.id.toString();
    const url = `/api/images/${fileId}`;

    return { fileId, url };
  } finally {
    await client.close();
  }
}

// Stream image from GridFS
export async function streamImageFromGridFS(fileId: string): Promise<{
  stream: NodeJS.ReadableStream;
  contentType: string;
  client: MongoClient;
} | null> {
  const { client, bucket } = await getGridFSBucket();

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(fileId)) {
      await client.close();
      return null;
    }

    const objectId = new ObjectId(fileId);

    // Get file metadata
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      await client.close();
      return null;
    }

    const file = files[0];
    const contentType = file.contentType || 'application/octet-stream';

    // Create download stream
    const downloadStream = bucket.openDownloadStream(objectId);

    return {
      stream: downloadStream,
      contentType,
      client, // Return client so caller can close it after streaming
    };
  } catch (error) {
    await client.close();
    throw error;
  }
}

// Optional: Delete image from GridFS
export async function deleteImageFromGridFS(fileId: string): Promise<boolean> {
  const { client, bucket } = await getGridFSBucket();

  try {
    if (!ObjectId.isValid(fileId)) {
      return false;
    }

    const objectId = new ObjectId(fileId);
    await bucket.delete(objectId);
    return true;
  } catch (error) {
    console.error('Error deleting image from GridFS:', error);
    return false;
  } finally {
    await client.close();
  }
}
