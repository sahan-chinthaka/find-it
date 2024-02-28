import { authOptions } from "@/lib/auth-config";
import { LostItemSchema } from "@/schema/lost";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

interface LostData {
	title: string;
	description: string;
	type: string;
}

async function runWithImages(imageParts: Part[], lost_data: LostData) {
	const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

	const prompt = `Please create a list of keywords to help find this lost item. Consider the title, description, type, images (including any recognizable text). Emphasize unique or distinguishing features. Title is '${lost_data.title}'. Description is '${lost_data.description}'. Type is '${lost_data.type}' Make keywords singular and do not use any character to seperate keywords. Do not generate unnecessary keywords. Give each keyword in a new line. You can add brands, colors, serial numbers if you can clearly identify. Here are some images of lost item.`;

	const result = await model.generateContent([prompt, ...imageParts]);
	const response = result.response;
	const text = response.text();
	return text.split("\n").map((a) => a.trim());
}

export async function PUT(req: NextRequest) {
	const data = await req.formData();
	const lostID = data.get("id");

	const images = [];
	const imageParts: Part[] = [];
	try {
		for (const [k, v] of data.entries()) {
			if (k == "images") {
				let file = v as File;
				if (file.size > 0) {
					const buffer = Buffer.from(await file.arrayBuffer());
					images.push(buffer);
					imageParts.push({
						inlineData: {
							data: buffer.toString("base64"),
							mimeType: file.type,
						},
					});
				}
			}
		}

		const tasks: Promise<any>[] = [];

		if (imageParts.length >= 1) {
			tasks.push(
				runWithImages(imageParts, {
					title: data.get("title") as string,
					description: data.get("description") as string,
					type: data.get("type") as string,
				}).then(async (keywords) => {
					await prisma.lostItem.update({
						where: {
							id: lostID?.toString(),
						},
						data: {
							keywords: {
								create: keywords.map((a) => ({ value: a })),
							},
						},
					});
				})
			);
		}

		const dir = path.join(process.cwd(), "temp/lost/" + lostID);
		if (images.length > 0) fs.mkdirSync(dir, { recursive: true });

		images.forEach((i, k) => {
			tasks.push(writeFile(dir + "/" + k + ".png", i));
		});
		
		await Promise.all(tasks);
		if (images.length >= 1)
			await prisma.lostItem.update({
				where: {
					id: lostID as string,
				},
				data: {
					images: images.length,
				},
			});
		return NextResponse.json({ message: "done" });
	} catch (e) {
		return NextResponse.json({ error: true, message: e });
	}
}

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
