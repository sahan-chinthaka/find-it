import { authOptions } from "@/lib/auth-config";
import { LostItemSchema } from "@/schema/lost";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	try {
		const data = LostItemSchema.parse(await req.json());
		const session = await getServerSession(authOptions);

		if (session?.user.uid) {
			const item = await prisma.lostItem.create({
				data: {
					title: data.title,
					description: data.description,
					type: data.type,
					location: data.location,
					date: data.date,
					userId: session?.user.uid,
				},
			});
			return NextResponse.json(item);
		}
		return NextResponse.json({ error: true, message: "No user" });
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
