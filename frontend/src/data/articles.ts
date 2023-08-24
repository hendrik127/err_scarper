export interface ArticleData {
  title: string;
  content: string;
}

export async function fetchArticles(): Promise<ArticleData[]> {
  const response = await fetch('http://localhost/');
  const data = await response.json();
  console.log(data)
  return data;
}
