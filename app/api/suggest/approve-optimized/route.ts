import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get requests to accept found items (Approve table)
 * Returns complete data including lost item details - optimized to avoid N+1 queries
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getServerSession(authOptions);
    const uid = user?.user?.uid;

    if (!uid) {
      return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
    }

    // Get all suggestions for found items owned by this user that are in "Request" stage
    const suggestions = await prisma.suggestItem.findMany({
      where: {
        FoundItem: {
          userId: uid,
        },
        stages: "Request",
      },
      include: {
        LostItem: {
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
      .filter((s) => s.LostItem)
      .map((s) => ({
        id: s.LostItem!.id,
        name: s.LostItem!.title,
        description: s.LostItem!.description,
        image: s.LostItem!.images?.[0] || "",
        sugessId: s.id,
        stages: s.stages,
      }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    console.error("Error fetching approve suggestions:", e);
    return NextResponse.json({ error: true, message: "Failed to fetch suggestions" }, { status: 500 });
  }
}
