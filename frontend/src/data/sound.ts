import { apiUrl } from './api';
export const fetchArticleSound = async (
  n_id: number,
  p_id: number,
  signal: AbortSignal
): Promise<Blob | undefined> => {
  const url = `${apiUrl}/audio/${n_id}/${p_id}`;
  try {
    const response = await fetch(url, { signal });
    if (signal.aborted) {
      throw new Error('Request aborted');
    }
    return await response.blob();
  } catch (error) {
    console.log(error)
  }
};
