export const fetchArticleSound = async (id: number): Promise<Blob> => {
  const url = `http://localhost/audio/${id}`; // Replace with your actual server URL

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.blob();
    });
};
