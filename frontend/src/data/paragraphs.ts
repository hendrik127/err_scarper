import { apiUrl } from "./api";
export async function fetchParagraphs(id: number): Promise<string[]> {
  const response = await fetch(`${apiUrl}/paragraphs/?id=${id}`);
  const data = await response.json();
  return data;
}


