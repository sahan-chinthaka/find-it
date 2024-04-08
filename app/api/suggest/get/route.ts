import { authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getServerSession(authOptions);
  const uid = user?.user.uid;

  const lostProductIds = await prisma.lostItem.findMany({
    select: {
      id: true,
    },
    where: {
      userId: uid,
      
    },
  });

  const promises = lostProductIds.map(async (item) => {
    const SuggestItemId = await prisma.suggestItem.findMany({
      select: {
        foundItemId: true,
      },
      where: {
        lostItemId: item.id,
        stages: "Pending",
      },
    });

    return SuggestItemId;
  });

  const results = await Promise.all(promises);
  const lostItemIds = results
    .map((result) => result.map((item) => item.foundItemId))
    .flat();

  return NextResponse.json({ lostItemIds });
}
