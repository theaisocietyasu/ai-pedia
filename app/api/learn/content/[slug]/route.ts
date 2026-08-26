import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { authErrorResponse, requireAuthWithRole } from "@/lib/auth/server";
import { mongoConnection } from "@/lib/db/client";
import { uploadImageToGridFS } from "@/lib/db/gridfs";
import { generateLearnModuleSlug, slugifyCategory } from "@/lib/slug";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    const collection = await mongoConnection.collection("learn_content");

    // Find by slug only
    const content = await collection.findOne({ slug: slug });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Return with cache control headers
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, s-maxage=3600",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching content by slug:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Check authentication and Discord role
    const session = await requireAuthWithRole();
    const userId = session.user.discordId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const categoriesString = formData.get("categories") as string;
    const actionButtonsString = formData.get("action_buttons") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const keepExistingThumbnail =
      formData.get("keep_existing_thumbnail") === "true";

    // Validate required fields
    if (!title || !description || !content || !categoriesString) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, content, and categories are required",
        },
        { status: 400 },
      );
    }

    const collection = await mongoConnection.collection("learn_content");
    const categoriesCollection =
      await mongoConnection.collection("learn_categories");

    // Find existing document
    const existingModule = await collection.findOne({ slug: slug });
    if (!existingModule) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Parse categories
    let categories: string[];
    try {
      categories = JSON.parse(categoriesString);
      if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Categories must be a non-empty array");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid categories format" },
        { status: 400 },
      );
    }

    // Parse action buttons (optional)
    let actionButtons = [];
    if (actionButtonsString) {
      try {
        actionButtons = JSON.parse(actionButtonsString);
      } catch {
        return NextResponse.json(
          { error: "Invalid action buttons format" },
          { status: 400 },
        );
      }
    }

    // Normalize and validate categories
    const normalizedCategorySlugs: string[] = [];
    for (const cat of categories) {
      const categorySlug = slugifyCategory(cat);
      const existing = await categoriesCollection.findOne({
        $or: [{ name: cat }, { name: new RegExp(`^${cat}$`, "i") }],
      });

      let valid = existing;
      if (!existing) {
        const bySlug = await categoriesCollection.findOne({
          $expr: {
            $eq: [
              {
                $replaceAll: {
                  input: { $toLower: { $trim: { input: "$name" } } },
                  find: " ",
                  replacement: "-",
                },
              },
              categorySlug,
            ],
          },
        });
        valid = bySlug;
      }

      if (!valid) {
        return NextResponse.json(
          { error: `Unknown category: ${cat}` },
          { status: 400 },
        );
      }
      normalizedCategorySlugs.push(categorySlug);
    }

    // Handle thumbnail upload if new file provided
    let thumbnailUrl = existingModule.thumbnail;
    if (thumbnailFile && !keepExistingThumbnail) {
      // Validate thumbnail file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(thumbnailFile.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid thumbnail file type. Please upload a JPG, PNG, GIF, or WebP image.",
          },
          { status: 400 },
        );
      }

      // Upload new thumbnail to GridFS
      const arrayBuffer = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { url } = await uploadImageToGridFS(
        buffer,
        thumbnailFile.name,
        thumbnailFile.type,
        userId,
      );
      thumbnailUrl = url;
    }

    // Generate new slug if title changed
    let newSlug = slug;
    if (title.trim() !== existingModule.title) {
      newSlug = generateLearnModuleSlug(title, existingModule._id.toString());
    }

    // Check if current user is already a contributor
    const existingContributors = existingModule.contributors || [];
    const isContributor = existingContributors.some(
      (c: { id: string }) => c.id === userId,
    );

    let contributors = existingContributors;
    if (!isContributor) {
      // Add current user as a new contributor
      const userName = session.user.name || session.user.email || "Anonymous";
      const userEmail = session.user.email;

      contributors = [
        ...existingContributors,
        {
          id: userId,
          name: userName,
          email: userEmail,
          addedAt: new Date(),
        },
      ];
    }

    // Prepare update object
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      content: content,
      categories: normalizedCategorySlugs,
      thumbnail: thumbnailUrl,
      action_buttons: actionButtons,
      slug: newSlug,
      contributors: contributors,
      updatedAt: new Date(),
    };

    // Update the document
    const updateResult = await collection.updateOne(
      { slug: slug },
      { $set: updateData },
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update content" },
        { status: 500 },
      );
    }

    // Fetch updated document
    const updatedModule = await collection.findOne({ slug: newSlug });

    // Revalidate relevant paths to clear Next.js cache
    try {
      revalidatePath("/learn");
      revalidatePath(`/learn/${normalizedCategorySlugs[0]}`);
      revalidatePath(`/learn/${normalizedCategorySlugs[0]}/${newSlug}`);
      if (newSlug !== slug) {
        revalidatePath(`/learn/${normalizedCategorySlugs[0]}/${slug}`);
      }
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: "Learn module updated successfully",
      slugChanged: newSlug !== slug,
      oldSlug: slug,
      newSlug: newSlug,
      module: updatedModule,
    });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error updating learn module:", error);
    return NextResponse.json(
      { error: "Internal server error while updating learn module" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Check authentication and Discord role
    const session = await requireAuthWithRole();
    const userId = session.user.discordId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 },
      );
    }

    const collection = await mongoConnection.collection("learn_content");

    // Check if the module exists
    const existingModule = await collection.findOne({ slug: slug });
    if (!existingModule) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Delete the module
    const deleteResult = await collection.deleteOne({ slug: slug });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete content" },
        { status: 500 },
      );
    }

    // Revalidate relevant paths to clear Next.js cache
    try {
      revalidatePath("/learn");
      if (existingModule.categories && existingModule.categories.length > 0) {
        revalidatePath(`/learn/${existingModule.categories[0]}`);
        revalidatePath(`/learn/${existingModule.categories[0]}/${slug}`);
      }
    } catch (revalidateError) {
      console.error("Error revalidating paths:", revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: "Learn module deleted successfully",
      deletedSlug: slug,
    });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error deleting learn module:", error);
    return NextResponse.json(
      { error: "Internal server error while deleting learn module" },
      { status: 500 },
    );
  }
}
