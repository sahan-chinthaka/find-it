import { authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
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
        where: {
          lostItemId: item.id,
          stages: "Accept",
        },
      });

      return SuggestItemId;
    });

    const results = await Promise.all(promises);

    // const lostItemIds = results
    //   .map((result) => result.map((item) => item.foundItemId))
    //   .flat();
    const flattenedArray = flattenArrayOfArrays(results);

    return NextResponse.json({ flattenedArray });
  } catch (e) {
    return NextResponse.json({ error: true, message: e });
  }
}


function flattenArrayOfArrays(arrayOfArrays: any[]) {
  return arrayOfArrays.reduce((acc, curr) => acc.concat(curr), []);
}
