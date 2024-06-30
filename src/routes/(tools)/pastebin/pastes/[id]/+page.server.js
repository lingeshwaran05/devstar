import prisma from '..lib/prisma';

export async function load({ params }) {
  const { id } = params;

  try {
    const paste = await prisma.paste.findUnique({
      where: { id: Number(id) },
    });

    if (!paste || new Date() > paste.expiresAt) {
      return {
        error: 'Paste not found or expired',
      };
    }

    return {
      paste,
    };
  } catch (error) {
    console.error('Error retrieving paste:', error);
    return {
      error: 'Failed to retrieve paste',
    };
  }
}
