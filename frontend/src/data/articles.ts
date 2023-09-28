export interface ArticleData {
  id: number;
  title: string;
}

export async function fetchPage(page = 1, pageSize = 20): Promise<ArticleData[]> {
  const response = await fetch(`http://localhost/titles/?page=${page}&page_size=${pageSize}`);
  const data = await response.json();
  // console.log(data[1].id)

  return data;
}


