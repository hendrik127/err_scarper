
export async function fetchParagraphs(id: number): Promise<string[]> {
  const response = await fetch(`http://localhost/paragraphs/?id=${id}`);
  const data = await response.json();
  // console.log(data[1].id)

  return data;
}


