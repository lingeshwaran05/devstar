import prisma from 'D:/Open source/MetaCraftlab/devstar-Tool20/src/lib/prisma.js';

export async function POST({ request }) {
  const { content, name, duration } = await request.json();

  try {
    const paste = await prisma.paste.create({
      data: {
        content,
        name,
        expiresAt: new Date(Date.now() + duration * 60000),
      },
    });

    const link = `${request.origin}/pastes/${paste.id}`;
    return new Response(JSON.stringify({ link }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating paste:', error);
    return new Response(JSON.stringify({ error: 'Failed to create paste' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
