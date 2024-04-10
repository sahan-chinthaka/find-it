import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const userid = req.url.slice(req.url.lastIndexOf("/") + 1);

	try {
		const item = await prisma.user.findUnique({
			where: {
				id: userid,
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
