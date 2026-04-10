import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { UserRegisterSchema } from "@/schema/user";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.uid) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get session data
  const sessionData = await getServerSession(authOptions);

  // Get user statistics
  const user = await prisma.user.findUnique({
    where: { id: session.user.uid },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      uname: true,
      createdAt: true,
      _count: {
        select: {
          LostItem: true,
          FoundItem: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get count of successful matches (SuggestItem with stage = "Done")
  const successfulMatches = await prisma.suggestItem.count({
    where: {
      OR: [{ LostItem: { userId: session.user.uid } }, { FoundItem: { userId: session.user.uid } }],
      stages: "Done",
    },
  });

  // Get count of pending suggestions
  const pendingMatches = await prisma.suggestItem.count({
    where: {
      OR: [{ LostItem: { userId: session.user.uid } }, { FoundItem: { userId: session.user.uid } }],
      stages: { in: ["Pending", "Request"] },
    },
  });

  return NextResponse.json({
    ...sessionData,
    user: {
      ...user,
      stats: {
        itemsReported: user._count.LostItem + user._count.FoundItem,
        successfulMatches,
        pendingMatches,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = UserRegisterSchema.parse(await req.json());

    const existingUser = await prisma.user.findUnique({
      where: {
        uname: data.uname,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: true, message: "There is an account with this email" });
    }

    const user = await prisma.user.create({
      data: {
        uname: data.uname,
        password: await bcrypt.hash(data.password, 10),
        name: data.name,
      },
    });

    const { password: _, ...ret } = user ?? {};
    return NextResponse.json({ ...ret, message: "done" });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: true, message: e.issues });
    } else if (e instanceof SyntaxError) {
      return NextResponse.json({ error: true, message: "Can't parse JSON input" });
    } else {
      return NextResponse.json({ error: true, message: e });
    }
  }
}
