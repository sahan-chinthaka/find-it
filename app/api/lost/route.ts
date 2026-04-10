import { authOptions } from "@/lib/auth-config";
import prisma from "@/lib/prisma";
import { distance } from "@/lib/utils";
import { LostItemSchema } from "@/schema/lost";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LostItemApiSchema = LostItemSchema.omit({ date: true }).extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

const GEMINI_KEY = process.env.GEMINI_KEY;
const GEMINI_MODEL = "gemini-3-flash-preview";

interface LostData {
  title: string;
  description: string;
  type: string;
}

async function makeSuggestions(keywords: string[], lost_id: string) {
  const data = await prisma.foundItem.findMany({
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
  const lostItem = await prisma.lostItem.findFirst({
    where: { id: lost_id },
    select: {
      places: { select: { lat: true, lng: true } },
    },
  });
  let final: any[] = [];

  data.forEach((item) => {
    let count = 0;
    item.keywords.forEach((k) => {
      if (keywords.includes(k.value)) count++;
    });
    let match = (1.0 * count) / keywords.length;
    const place = item.places[0];

    if (lostItem)
      for (let i = 0; i < lostItem.places.length; i++) {
        const p = lostItem.places[i];
        const d = distance(place.lat.toNumber(), place.lng.toNumber(), p.lat.toNumber(), p.lng.toNumber(), "K");
        if (d <= 10) {
          match += 0.2;
          break;
        }
      }

    // Add only if matching is greater than 40%
    if (match > 0.4) final.push({ ...item, match });
  });
  final = final.sort((a, b) => b.match - a.match).slice(0, 5);
  await prisma.suggestItem.createMany({
    data: final.map((a) => ({ foundItemId: a.id, lostItemId: lost_id, stages: "Pending" })),
  });
  return final;
}

async function runWithImages(imageParts: any[], lost_data: LostData) {
  const prompt = `Please create a list of keywords to help find this lost item. Consider the title, description, images (including any recognizable text). Emphasize unique or distinguishing features. Title is '${lost_data.title}'. Description is '${lost_data.description}'. Make keywords singular and do not use any character to seperate keywords. Do not generate unnecessary keywords. Give each keyword in a new line. You can add brands, colors, serial numbers if you can clearly identify. Here are some images of lost item. Limit the keywords to 10.`;

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
    .map((a: string) => a.trim())
    .filter((a: string) => a.length > 0);
}

export async function PUT(req: NextRequest) {
  const data = await req.formData();
  const lostID = data.get("id");

  const imagesUpload = [];
  const imageParts: any[] = [];
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

    const p = await Promise.all(imagesUpload);
    if (p.length > 0) {
      await prisma.lostItem.update({
        where: {
          id: lostID.toString(),
        },
        data: {
          images: p.map((a) => a.url),
        },
      });
    }

    if (imageParts.length >= 1) {
      try {
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
              create: keywords.map((a: string) => ({ value: a })),
            },
          },
        });
        await makeSuggestions(keywords, lostID as string);
      } catch (aiError) {
        console.error("Lost AI enrichment failed:", aiError);
      }
    }

    return NextResponse.json({ message: "done" });
  } catch (e) {
    return NextResponse.json({ error: true, message: e });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = LostItemApiSchema.parse(json);
    const itemDate = parseDateOnly(data.date);
    const session = await getServerSession(authOptions);

    if (session?.user.uid) {
      const item = await prisma.lostItem.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          location: data.location,
          date: itemDate,
          userId: session?.user.uid,
          places: {
            create: json.places.map((a: any) => ({
              place_key: a.place_id,
              description: a.description,
              lat: a.lat,
              lng: a.lng,
            })),
          },
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
