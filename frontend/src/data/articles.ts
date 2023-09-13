export interface ArticleData {
  id: number;
  title: string;
  content: string[];
}

export async function fetchArticles(): Promise<ArticleData[]> {
  const response = await fetch('http://localhost/sort');
  const data = await response.json();
  console.log(data)
  const d = data.slice(0, 20);

  return d;
}

export async function fetchArticle(id: number): Promise<ArticleData[]> {
  const response = await fetch(`http://localhost/posts/${id}`);
  const data = await response.json();
  console.log(data)
  // const d = data.slice(0, 20);

  return data;
}
