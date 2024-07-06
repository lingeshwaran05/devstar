
import { error } from "@sveltejs/kit";
import { uniqueId, hash } from "$lib/encryptUtil";
import { insertPaste, initializeDatabase, getAllPastes } from "$lib/dataStore";

await initializeDatabase();

export const actions = {
  createPaste: async ({ request }) => {
    const formData = await request.formData();
    let text = formData.get("text");
    const title = formData.get("title");
    const paste_expiration = formData.get("paste_expiration");

    try {
      const expirationTimestamp = paste_expiration === 'never' ? null : Date.now() + parseExpirationTime(paste_expiration);
      const dataToBeInserted = {
        id: uniqueId(),
        text,
        title,
        paste_expiration: expirationTimestamp,
      };

      await insertPaste(dataToBeInserted);
      return { success: true };
    } catch (err) {
      console.error("Error creating paste:", err);
      throw error(500, "An error occurred while creating the paste. Please try again later.");
    }
  },
};

export async function load() {
  const pastes = await getAllPastes();
  return { pastes };
}

function parseExpirationTime(expirationString) {
  const [value, unit] = expirationString.split(" ");
  const numericValue = parseInt(value, 10);

  if (expirationString === "never") {
    return Infinity; // Handle the "never" option
  }

  function parseExpirationTime(expirationString) {
    if (expirationString === "never") {
      return Infinity; // Handle the "never" option
    }
  
    const [value, unit] = expirationString.split(" ");
    const numericValue = parseInt(value, 10);
  
    switch (unit) {
      case "minute":
      case "minutes":
        return numericValue * 60 * 1000; // Convert to milliseconds
      case "hour":
      case "hours":
        return numericValue * 3600 * 1000; // Convert to milliseconds
      case "day":
      case "days":
        return numericValue * 86400 * 1000; // Convert to milliseconds
      case "week":
      case "weeks":
        return numericValue * 7 * 86400 * 1000; // Convert to milliseconds
      case "month":
      case "months":
        return numericValue * 30 * 86400 * 1000; // Approximate month to 30 days, convert to milliseconds
      default:
        throw new Error("Invalid expiration time format");
    }
  }
}
