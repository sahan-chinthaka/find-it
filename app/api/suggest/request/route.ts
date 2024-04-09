import { authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerSession(authOptions);
    const uid = user?.user.uid;

    const foundProductIds = await prisma.foundItem.findMany({
      select: {
        id: true,
      },
      where: {
        userId: uid,
      },
    });

    const promises = foundProductIds.map(async (item) => {
      const SuggestItemId = await prisma.suggestItem.findMany({
        where: {
          foundItemId: item.id,
          stages: "Request",
        },
      });

      return SuggestItemId;
    });

    const results = await Promise.all(promises);
    const flattenedArray = flattenArrayOfArrays(results);

    return NextResponse.json({ flattenedArray });
  } catch (e) {
    return NextResponse.json({ error: true, message: e });
  }
}

function flattenArrayOfArrays(arrayOfArrays: any[]) {
  return arrayOfArrays.reduce((acc, curr) => acc.concat(curr), []);
}
