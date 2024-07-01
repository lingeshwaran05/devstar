// routes/pastebin/api/+server.js
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const pastes = new Map();

const secretKey = "f464fdcbd76681b5b1e44ebfd2a5a4989ad4ab6db151bc10743e7147d34a3dff".slice(0,32);
const iv = "7dbfb688da37f2ed35ee7f5f194a8ff8".slice(0,16);

function parseExpirationTime(expirationString) {
  const [value, unit] = expirationString.split(' ');
  const numericValue = parseInt(value, 10);

  switch (unit) {
    case 'minutes':
    case 'minute':
      return numericValue * 60;
    case 'hours':
    case 'hour':
      return numericValue * 3600;
    case 'days':
    case 'day':
      return numericValue * 86400;
    default:
      throw new Error('Invalid expiration time format');
  }
}

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
  const expirationTimestamp = Date.now() + (expirationInSeconds * 1000);

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

  pastes.set(id, {
    id,
    title,
    text: encryptedText,
    password,
    encrypted,
    expirationTimestamp,
  });

  return new Response(JSON.stringify({ id }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET({ params }) {
  const id = params.id;
  const paste = pastes.get(id);

  if (!paste || paste.expirationTimestamp < Date.now()) {
    pastes.delete(id);
    throw error(404, 'Paste not found or expired');
  }

  let text = paste.text;
  if (paste.encrypted) {
    text = decryptData(paste.text);
  }

  return json({
    id: paste.id,
    title: paste.title,
    text,
    password: paste.password,
    encrypted: paste.encrypted,
    expirationTimestamp: paste.expirationTimestamp,
  });
}
