export async function saveCharacter(character, image) {
  const response = await fetch("src/routes/(tools)/custom-handwriting-font/api/saveCharacter.ts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ character, image }),
  });
  if (!response.ok) {
    throw new Error("Failed to save character");
  }

  return response.json();
}

export async function fetchHandwriting() {
  const response = await fetch("src/routes/(tools)/custom-handwriting-font/api/fetchHandwriting.ts");
  if (!response.ok) {
    throw new Error("Failed to fetch handwriting data");
  }

  return response.json();
}
