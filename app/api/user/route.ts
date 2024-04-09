import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { UserRegisterSchema } from "@/schema/user";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
	return NextResponse.json(await getServerSession(authOptions));
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
