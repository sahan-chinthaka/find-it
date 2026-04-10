import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const updatesuggestItem = await prisma.suggestItem.update({
    where: { 
        id: data.id, 
    },
    data: { stages: data.stages }, 
});
  return NextResponse.json(updatesuggestItem);
}
