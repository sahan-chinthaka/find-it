import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { distance } from "@/lib/utils";
import { FoundItemSchema } from "@/schema/found";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const GEMINI_KEY = process.env.GEMINI_KEY;
const GEMINI_MODEL = "gemini-3-flash-preview";

const FoundItemApiSchema = FoundItemSchema.omit({ date: true }).extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

interface FoundData {
  title: string;
  description: string;
  type: string;
}

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
    // Add only if matching is greater than 40%
    if (match > 0.4) final.push({ ...item, match });
  });
  final = final.sort((a, b) => b.match - a.match).slice(0, 5);
  await prisma.suggestItem.createMany({
    data: final.map((a) => ({ foundItemId: found_id, lostItemId: a.id, stages: "Pending" })),
  });
  return final;
}

async function runWithImages(imageParts: any[], found_data: FoundData) {
  const prompt = `Please create a list of keywords to help find this lost item. Consider the title, description, images (including any recognizable text). Emphasize unique or distinguishing features. Title is '${found_data.title}'. Description is '${found_data.description}'. Make keywords singular and do not use any character to seperate keywords. Do not generate unnecessary keywords. Give each keyword in a new line. You can add brands, colors, serial numbers if you can clearly identify. Here are some images of lost item. Limit the keywords to 10.`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_KEY || "",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, ...imageParts],
        },
      ],
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(error)}`);
  }

  const data = (await response.json()) as any;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return text
    .split("\n")
    .map((a: string) => a.replace(/\*\-/g, "").trim())
    .filter((a: string) => a.length > 0);
}

export async function PUT(req: NextRequest) {
  try {
    const form = await req.formData();
    const foundId = form.get("foundId");
    if (!foundId) throw new Error("FoundId not found");

    const imagesUpload = [];
    const imageParts: any[] = [];

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
            }),
          );
          imageParts.push({
            inlineData: {
              mimeType: file.type,
              data: buffer.toString("base64"),
            },
          });
        }
      }
    }

    if (imagesUpload.length > 0) {
      const p = await Promise.all(imagesUpload);
      await prisma.foundItem.update({
        where: {
          id: foundId?.toString(),
        },
        data: {
          images: p.map((a) => a.url),
        },
      });
    }

    if (imageParts.length >= 1) {
      try {
        const keywords = await runWithImages(imageParts, {
          title: form.get("title") as string,
          description: form.get("description") as string,
          type: form.get("type") as string,
        });
        await prisma.foundItem.update({
          where: {
            id: foundId?.toString(),
          },
          data: {
            keywords: {
              create: keywords.map((a: string) => ({ value: a })),
            },
          },
        });
        await makeSugestions(keywords, foundId as string);
      } catch (aiError) {
        console.error("Found AI enrichment failed:", aiError);
      }
    }

    return NextResponse.json({ message: "done" });
  } catch (e: any) {
    return NextResponse.json({ error: true, message: e.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = FoundItemApiSchema.parse(json);
    const itemDate = parseDateOnly(data.date);
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
        date: itemDate,
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

export async function GET() {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user.uid) throw new Error("User not found");

    const items = await prisma.foundItem.findMany({
      where: {
        userId: session.user.uid,
      },
    });

    return NextResponse.json(items);
  } catch (e: any) {
    return NextResponse.json({ error: true, message: e.message });
  }
}
