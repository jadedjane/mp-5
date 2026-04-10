import { NextResponse } from "next/server";
import getCollection, { LINKS_COLLECTION } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { url, alias } = await req.json();
        const cleanAlias = alias?.trim().toLowerCase();

        if (!url || !cleanAlias) {
            return NextResponse.json(
                { error: "URL and alias are required." },
                { status: 400 }
            );
        }

        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Please enter a valid URL." },
                { status: 400 }
            );
        }

        const collection = await getCollection(LINKS_COLLECTION);

        const existing = await collection.findOne({ alias: cleanAlias });

        if (existing) {
            return NextResponse.json(
                { error: "Alias is already taken." },
                { status: 400 }
            );
        }

        await collection.insertOne({ url, alias: cleanAlias });

        return NextResponse.json(
            { shortUrl: `/r/${cleanAlias}` },
            { status: 201 }
        );
    } catch (error) {
        console.error("SHORTEN API ERROR:", error);

        return NextResponse.json(
            { error: "Something went wrong on the server." },
            { status: 500 }
        );
    }
}