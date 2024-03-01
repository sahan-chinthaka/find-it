import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { LostItemSchema } from "@/schema/lost";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

interface LostData {
	title: string;
	description: string;
	type: string;
}

async function runWithImages(imageParts: Part[], lost_data: LostData) {
	const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

	const prompt = `Please create a list of keywords to help find this lost item. Consider the title, description, images (including any recognizable text). Emphasize unique or distinguishing features. Title is '${lost_data.title}'. Description is '${lost_data.description}'. Make keywords singular and do not use any character to seperate keywords. Do not generate unnecessary keywords. Give each keyword in a new line. You can add brands, colors, serial numbers if you can clearly identify. Here are some images of lost item. Limit the keywords to 10.`;

	const result = await model.generateContent([prompt, ...imageParts]);
	const response = result.response;
	const text = response.text();
	return text.split("\n").map((a) => a.trim());
}

export async function PUT(req: NextRequest) {
	const data = await req.formData();
	const lostID = data.get("id");

	const imagesUpload = [];
	const imageParts: Part[] = [];
	try {
		if (!lostID) {
			throw new Error("Lost id is not present");
		}

		let count = 0;
		for (const [k, v] of data.entries()) {
			if (k == "images") {
				let file = v as File;
				if (file.size > 0) {
					const buffer = Buffer.from(await file.arrayBuffer());
					imagesUpload.push(
						put(lostID.toString() + "-" + count++, file, {
							access: "public",
							contentType: file.type,
						})
					);
					console.log(file);
					imageParts.push({
						inlineData: {
							data: buffer.toString("base64"),
							mimeType: file.type,
						},
					});
				}
			}
		}

		if (imageParts.length >= 1) {
			const keywords = await runWithImages(imageParts, {
				title: data.get("title") as string,
				description: data.get("description") as string,
				type: data.get("type") as string,
			});
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
		}
		await Promise.all(imagesUpload);
		await prisma.lostItem.update({
			where: {
				id: lostID.toString(),
			},
			data: {
				images: imagesUpload.length,
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
export async function GET() {
	const session = await getServerSession(authOptions);

	try {
		if (!session?.user.uid) throw new Error("User not found");

		const items = await prisma.lostItem.findMany({
			where: {
				userId: session.user.uid,
			},
		});

		return NextResponse.json(items);
	} catch (e: any) {
		return NextResponse.json({ error: true, message: e.message });
	}
}
