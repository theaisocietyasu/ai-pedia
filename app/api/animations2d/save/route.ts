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

export async function POST(request: Request) {
  try {
    await connectToDb();

    const { name, description, config } = await request.json();

    if (!name || !config) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const animation = await Animation2D.create({
      name,
      description: description || "",
      config,
    });

    const id = `VZ2D-${animation._id.toString()}`;

    return NextResponse.json(
      {
        success: true,
        id,
        animation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Save 2D animation error:", error);
    return NextResponse.json(
      { error: "Failed to save 2D animation" },
      { status: 500 },
    );
  }
}

