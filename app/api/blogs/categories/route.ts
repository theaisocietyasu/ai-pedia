import { type NextRequest, NextResponse } from "next/server";
import { blogsCollection } from "@/lib/db/models/blog";

export async function GET(_request: NextRequest) {
  try {
    const blogsColl = await blogsCollection();

    // Get distinct categories from all blogs
    const categories = await blogsColl.distinct("categories");

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await blogsColl.countDocuments({
          categories: category,
        });
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
