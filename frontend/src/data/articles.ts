export interface ArticleData {
  id: number;
  title: string;
  content: string[];
}

export async function fetchPage(page = 1, pageSize = 20): Promise<ArticleData[]> {
  const response = await fetch(`http://localhost/posts?page=${page}&page_size=${pageSize}`);
  const data = await response.json();
  console.log(data)

  return data;
}


