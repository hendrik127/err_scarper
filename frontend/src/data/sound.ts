import { apiUrl } from "./api";
export const fetchArticleSound = (n_id: number, p_id: number): Promise<Blob> => {
  const url = `${apiUrl}/audio/${n_id}/${p_id}`;
  return fetch(url)
    .then((response) => {
      return response.blob();
    });
};
