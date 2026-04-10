import { redirect } from "next/navigation";
import getCollection, { LINKS_COLLECTION } from "@/lib/db";

export async function GET(
    req: Request,
    context: { params: Promise<{ alias: string }> }
) {
    const { alias } = await context.params;
    const collection = await getCollection(LINKS_COLLECTION);

    const cleanAlias = alias.trim().toLowerCase();

    const link = await collection.findOne({
        alias: cleanAlias,
    });

    if (!link) {
        return new Response("Alias not found", { status: 404 });
    }

    redirect(link.url);
}