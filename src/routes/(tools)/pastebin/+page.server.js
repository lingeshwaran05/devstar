/** @type {import('./$types').Actions} */
import { error } from "@sveltejs/kit";
import { encryptData, decryptData, uniqueId, hash } from "$lib/encryptUtil";
import { insertPaste } from "$lib/dataStore";
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    let text = formData.get("text");
    const password = formData.get("password");
    const title = formData.get("title");
    const paste_expiration = formData.get("paste_expiration");
    const encrypted = formData.get("encrypt") ? true : false;

    if (encrypted) {
      text = encryptData(text);
    }
    try {
      const dataToBeInserted = {
        id: uniqueId(),
        text: text,
        title: title,
        password: await hash(password),
        paste_expiration: paste_expiration,
        encrypted
      };

      console.log(dataToBeInserted);
      await insertPaste(dataToBeInserted);
    } catch (err) {
      throw error(err);
    }
  },
};