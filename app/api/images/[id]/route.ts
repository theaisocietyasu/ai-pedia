import { NextRequest, NextResponse } from 'next/server';
import { streamImageFromGridFS } from '@/lib/gridfs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Stream image from GridFS
    const result = await streamImageFromGridFS(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const { stream, contentType, client } = result;

    // Convert Node stream to Web Stream
    const readableStream = new ReadableStream({
      async start(controller) {
        stream.on('data', (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });

        stream.on('end', async () => {
          controller.close();
          await client.close(); // Close MongoDB connection after streaming
        });

        stream.on('error', async (error) => {
          console.error('Stream error:', error);
          controller.error(error);
          await client.close();
        });
      },
    });

    // Return image with proper headers
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
