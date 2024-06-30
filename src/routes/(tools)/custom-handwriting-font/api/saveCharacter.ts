import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { character, image } = await request.json();

    await prisma.handwriting.upsert({
      where: { id: undefined, character },
      update: { image },
      create: { character, image },
    });

    return new Response(JSON.stringify({ message: "Character saved" }), {
      status: 200,
    });
    
  } catch (error) {
    console.error("Error saving character:", error);
    return new Response(JSON.stringify({ error: "An error occurred while saving the character." }), {
      status: 500,
    });
  }
};
