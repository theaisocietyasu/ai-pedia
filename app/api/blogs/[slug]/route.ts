import { type NextRequest, NextResponse } from "next/server";
import { blogsCollection } from "@/lib/db/models/blog";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const blogsColl = await blogsCollection();

    const { slug } = await params;

    // First try to find by slug field
    let blog = await blogsColl.findOne({ slug });

    // If not found, try to find by auto-generated slug from title
    if (!blog) {
      // Generate slug from title for blogs that don't have explicit slug
      const blogs = await blogsColl.find({}).toArray();
      blog =
        blogs.find((b) => {
          if (!b.slug && b.title) {
            const autoSlug = b.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim();
            return autoSlug === slug;
          }
          return false;
        }) ?? null;
    }

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
          message: `No blog found with slug: ${slug}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
