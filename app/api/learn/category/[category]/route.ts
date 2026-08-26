import { NextResponse } from "next/server";
import { mongoConnection } from "@/lib/db/client";
import { slugifyCategory } from "@/lib/slug";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;

    const collection = await mongoConnection.collection("learn_content");
    const categoriesCollection =
      await mongoConnection.collection("learn_categories");

    // Resolve the canonical category name from the slug
    const slug = slugifyCategory(category);
    const categoryDoc = await categoriesCollection.findOne({
      $expr: {
        $eq: [
          {
            $replaceAll: {
              input: { $toLower: { $trim: { input: "$name" } } },
              find: " ",
              replacement: "-",
            },
          },
          slug,
        ],
      },
    });
    const legacyName = categoryDoc?.name;

    // Query by current format (slug) OR legacy format (stored full name)
    const modules = await collection
      .find({
        $or: [
          { categories: { $in: [slug] } },
          ...(legacyName ? [{ categories: { $in: [legacyName] } }] : []),
        ],
      })
      .toArray();

    // Transform to match expected format
    const filteredContent = modules.map((item) => ({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      categories: item.categories,
      thumbnail: item.thumbnail,
      description: item.description || "",
    }));

    return NextResponse.json(filteredContent, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, s-maxage=3600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching modules by category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
