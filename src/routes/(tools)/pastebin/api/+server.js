import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { getPaste, initializeDatabase, deleteExpiredPastes } from "$lib/dataStore";

initializeDatabase(); // Ensure this runs once at startup

const secretKey = "f464fdcbd76681b5b1e44ebfd2a5a4989ad4ab6db151bc10743e7147d34a3dff".slice(0,32);
const iv = "7dbfb688da37f2ed35ee7f5f194a8ff8".slice(0,16);

setInterval(deleteExpiredPastes, 60 * 1000); // Check for expired pastes every minute

export async function POST({ request }) {
  const formData = await request.formData();
  const text = formData.get('text');
  const title = formData.get('title');
  const password = formData.get('password');
  const pasteExpiration = formData.get('paste_expiration');
  const encrypted = formData.get('encrypt') ? true : false;

  let expirationInSeconds;
  try {
    expirationInSeconds = parseExpirationTime(pasteExpiration);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const id = uuidv4();
  const expirationTimestamp = Date.now() + expirationInSeconds;

  let encryptedText = text;
  if (encrypted) {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(secretKey),
      Buffer.from(iv)
    );
    let encryptedData = cipher.update(text, "utf8", "hex");
    encryptedData += cipher.final("hex");
    encryptedText = encryptedData;
  }

  await insertPaste({ id, text: encryptedText, title, password, paste_expiration: expirationTimestamp, encrypted });

  return new Response(JSON.stringify({ id }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET({ params }) {
  await deleteExpiredPastes();
  const id = params.id;
  const paste = await getPaste(id);

  if (!paste) {
    throw error(404, 'Paste not found or expired');
  }

  let text = paste.text;
  if (paste.encrypted) {
    text = decryptData(paste.text);
  }

  return new Response(JSON.stringify({
    id: paste.id,
    title: paste.title,
    text,
    password: paste.password,
    encrypted: paste.encrypted,
    expirationTimestamp: paste.paste_expiration,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function parseExpirationTime(expirationString) {
  const [value, unit] = expirationString.split(' ');
  const numericValue = parseInt(value, 10);

  switch (unit) {
    case 'minutes':
    case 'minute':
      return numericValue * 60 * 1000; // Convert to milliseconds
    case 'hours':
    case 'hour':
      return numericValue * 3600 * 1000; // Convert to milliseconds
    case 'days':
    case 'day':
      return numericValue * 86400 * 1000; // Convert to milliseconds
    default:
      throw new Error('Invalid expiration time format');
  }
}
