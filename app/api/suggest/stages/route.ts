import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
