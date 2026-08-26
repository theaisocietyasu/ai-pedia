import { type NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireAuthWithRole } from "@/lib/auth/server";
import { mongoConnection } from "@/lib/db/client";
import { generateLearnModuleSlug } from "@/lib/slug";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and Discord role - only authenticated admins can run migrations
    const session = await requireAuthWithRole();
    const userId = session.user.discordId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collection = await mongoConnection.collection("learn_content");

    // Find all documents without slugs
    const documentsWithoutSlugs = await collection
      .find({
        slug: { $exists: false },
      })
      .toArray();

    if (documentsWithoutSlugs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All documents already have slugs",
        updated: 0,
      });
    }

    // Generate and update slugs for each document
    const updatePromises = documentsWithoutSlugs.map(async (doc) => {
      const slug = generateLearnModuleSlug(doc.title, doc._id.toString());

      await collection.updateOne({ _id: doc._id }, { $set: { slug: slug } });

      return {
        _id: doc._id.toString(),
        title: doc.title,
        slug: slug,
      };
    });

    const updatedDocuments = await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `Successfully added slugs to ${updatedDocuments.length} documents`,
      updated: updatedDocuments.length,
      documents: updatedDocuments,
    });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error migrating slugs:", error);
    return NextResponse.json(
      { error: "Internal server error while migrating slugs" },
      { status: 500 },
    );
  }
}

// GET endpoint to check migration status
export async function GET(request: NextRequest) {
  try {
    const collection = await mongoConnection.collection("learn_content");

    const totalDocs = await collection.countDocuments();
    const docsWithSlugs = await collection.countDocuments({
      slug: { $exists: true },
    });
    const docsWithoutSlugs = totalDocs - docsWithSlugs;

    return NextResponse.json({
      total: totalDocs,
      withSlugs: docsWithSlugs,
      withoutSlugs: docsWithoutSlugs,
      migrationNeeded: docsWithoutSlugs > 0,
    });
  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json(
      { error: "Internal server error while checking migration status" },
      { status: 500 },
    );
  }
}
