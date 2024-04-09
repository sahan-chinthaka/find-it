import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { distance } from "@/lib/utils";
import { FoundItemSchema } from "@/schema/found";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface FoundData {
	title: string;
	description: string;
	type: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

async function makeSugestions(keywords: string[], found_id: string) {
	const data = await prisma.lostItem.findMany({
		where: {
			keywords: {
				some: {
					value: { in: keywords },
				},
			},
		},
		select: {
			keywords: true,
			id: true,
			places: true,
		},
	});
	const foundItem = await prisma.foundItem.findFirst({
		where: { id: found_id },
		select: {
			places: { select: { lat: true, lng: true } },
		},
	});
	let final: any[] = [];
	const place = foundItem?.places[0];

	data.forEach((item) => {
		let count = 0;
		item.keywords.forEach((k) => {
			if (keywords.includes(k.value)) count++;
		});
		let match = (1.0 * count) / keywords.length;

		for (let i = 0; i < item.places.length; i++) {
			const p = item.places[i];
			if (place) {
				const d = distance(p.lat.toNumber(), p.lng.toNumber(), place?.lat.toNumber(), place.lng.toNumber(), "K");

				// Add 20% if item is near from lost item about 10km
				if (d <= 10) {
					match += 0.2;
					break;
				}
			}
		}
		// Add only if matching is greater than 60%
		if (match > 0.6) final.push({ ...item, match });
	});
	final = final.sort((a, b) => b.match - a.match).slice(0, 5);
	await prisma.suggestItem.createMany({
		data: final.map((a) => ({ foundItemId: found_id, lostItemId: a.id, stages: "Pending" })),
	});
	return final;
}

async function runWithImages(imageParts: Part[], found_data: FoundData) {
	const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

	const prompt = `Please create a list of keywords to help find this lost item. Consider the title, description, images (including any recognizable text). Emphasize unique or distinguishing features. Title is '${found_data.title}'. Description is '${found_data.description}'. Make keywords singular and do not use any character to seperate keywords. Do not generate unnecessary keywords. Give each keyword in a new line. You can add brands, colors, serial numbers if you can clearly identify. Here are some images of lost item. Limit the keywords to 10.`;

	const result = await model.generateContent([prompt, ...imageParts]);
	const response = result.response;
	const text = response.text();
	return text.split("\n").map((a) => a.replace(/\*\-/g, "").trim());
}

export async function PUT(req: NextRequest) {
	try {
		const form = await req.formData();
		const foundId = form.get("foundId");
		if (!foundId) throw new Error("FoundId not found");

		const imagesUpload = [];
		const imageParts: Part[] = [];

		let count = 0;
		for (const [k, v] of form.entries()) {
			if (k == "images") {
				let file = v as File;
				if (file.size > 0) {
					const buffer = Buffer.from(await file.arrayBuffer());
					imagesUpload.push(
						put(foundId.toString() + "-" + count++, file, {
							access: "public",
							contentType: file.type,
						})
					);
					imageParts.push({
						inlineData: {
							data: buffer.toString("base64"),
							mimeType: file.type,
						},
					});
				}
			}
		}
		let suggestions = null;
		if (imageParts.length >= 1) {
			const keywords = await runWithImages(imageParts, {
				title: form.get("title") as string,
				description: form.get("description") as string,
				type: form.get("type") as string,
			});
			suggestions = makeSugestions(keywords, foundId as string);
			await prisma.foundItem.update({
				where: {
					id: foundId?.toString(),
				},
				data: {
					keywords: {
						create: keywords.map((a) => ({ value: a })),
					},
					images: imagesUpload.length,
				},
			});
		}
		await Promise.all(imagesUpload);
		await suggestions;

		return NextResponse.json({ message: "done" });
	} catch (e: any) {
		return NextResponse.json({ error: true, message: e.message });
	}
}

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const data = FoundItemSchema.parse(json);
		const session = await getServerSession(authOptions);

		if (!session?.user.uid) throw new Error("User not found");
		if (!json.place || !json.place.place_id || !json.place.description || !json.place.lat || !json.place.lat)
			throw new Error("Place not found");

		const found = await prisma.foundItem.create({
			data: {
				title: data.title,
				description: data.description,
				location: data.location,
				type: data.type,
				userId: session.user.uid,
				places: {
					create: [
						{
							place_key: json.place.place_id,
							description: json.place.description,
							lat: json.place.lat,
							lng: json.place.lng,
						},
					],
				},
			},
		});

		return NextResponse.json({ message: "done", foundId: found.id });
	} catch (e: any) {
		return NextResponse.json({ error: true, message: e.message });
	}
}
