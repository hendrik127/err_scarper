import { apiUrl } from "./api";
export interface ArticleData {
  id: number;
  title: string;
}

export async function fetchPage(page = 1, pageSize = 20): Promise<ArticleData[]> {
  const response = await fetch(`${apiUrl}/titles/?page=${page}&page_size=${pageSize}`);
  const data = await response.json();
  return data;
}


