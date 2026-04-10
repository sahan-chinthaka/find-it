import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get suggestions for items posted by the current user (Accept table)
 * Returns complete data including found item details - optimized to avoid N+1 queries
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getServerSession(authOptions);
    const uid = user?.user?.uid;

    if (!uid) {
      return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
    }

    // Get all suggestions for lost items owned by this user
    const suggestions = await prisma.suggestItem.findMany({
      where: {
        LostItem: {
          userId: uid,
        },
        stages: "Pending",
      },
      include: {
        FoundItem: {
          select: {
            id: true,
            title: true,
            description: true,
            images: true,
          },
        },
      },
    });

    // Transform into the format expected by the component
    const items = suggestions
      .filter((s) => s.FoundItem)
      .map((s) => ({
        id: s.FoundItem!.id,
        name: s.FoundItem!.title,
        description: s.FoundItem!.description,
        image: s.FoundItem!.images?.[0] || "",
        sugessId: s.id,
        stages: s.stages,
      }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    console.error("Error fetching accept suggestions:", e);
    return NextResponse.json({ error: true, message: "Failed to fetch suggestions" }, { status: 500 });
  }
}
