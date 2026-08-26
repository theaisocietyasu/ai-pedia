import { type NextRequest, NextResponse } from "next/server";
import Blog from "@/lib/db/models/blog";
import connectToDatabase from "@/lib/db/mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("categories");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    // Build query
    const query: Record<string, any> = {};

    if (category && category !== "all") {
      query.categories = { $regex: new RegExp(category, "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { excerpt: { $regex: new RegExp(search, "i") } },
        { tags: { $elemMatch: { $regex: new RegExp(search, "i") } } },
      ];
    }

    // Execute query
    let blogsQuery = Blog.find(query).sort({ publishDate: -1 });

    if (limit > 0) {
      blogsQuery = blogsQuery.limit(limit);
    }

    const blogs = await blogsQuery.exec();

    return NextResponse.json({
      success: true,
      data: blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);

    // More specific error messages
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      if (
        error.message.includes("ETIMEOUT") ||
        error.message.includes("querySrv")
      ) {
        errorMessage =
          "MongoDB connection timeout - check network or IP whitelist";
      } else if (error.message.includes("authentication")) {
        errorMessage = "MongoDB authentication failed";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
        message: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
