import { type NextRequest, NextResponse } from "next/server";
import Blog from "@/lib/db/models/blog";
import connectToDatabase from "@/lib/db/mongoose";

export async function GET(_request: NextRequest) {
  try {
    await connectToDatabase();

    // Get distinct categories from all blogs
    const categories = await Blog.distinct("categories").exec();

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Blog.countDocuments({
          categories: category,
        }).exec();
        return {
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
          count,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
