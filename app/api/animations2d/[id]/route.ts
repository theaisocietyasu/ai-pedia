import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Animation2D } from "@/models/animation_2d";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDb() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  try {
    await connectToDb();

    const rawId = context.params.id;
    const mongoId = rawId.startsWith("VZ2D-")
      ? rawId.replace("VZ2D-", "")
      : rawId;

    const animation = await Animation2D.findById(mongoId).lean();

    if (!animation) {
      return NextResponse.json(
        { error: "2D animation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(animation, { status: 200 });
  } catch (error) {
    console.error("Fetch 2D animation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch 2D animation" },
      { status: 500 },
    );
  }
}

