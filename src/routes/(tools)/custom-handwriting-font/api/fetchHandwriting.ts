import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "@sveltejs/kit";

const prisma = new PrismaClient();

export const GET: RequestHandler = async () => {
  try {
    const data = await prisma.handwriting.findMany();
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching handwriting data:", error);
    return new Response(JSON.stringify({ error: "An error occurred while fetching handwriting data." }), {
      status: 500,
    });
  }
};
