import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const lostID = req.url.slice(req.url.lastIndexOf("/") + 1);

	try {
		const item = await prisma.lostItem.findUnique({
			where: {
				id: lostID,
			},
		});
		if (item) {
			return NextResponse.json(item);
		}
		return NextResponse.json({ error: true, message: "Not found" }, { status: 404 });
	} catch (e) {
		return NextResponse.json({ error: true, message: e });
	}
}
