'use client'
import { useEffect, useState, useRef } from 'react';
import { ArticleData, fetchPage } from './data/articles'
import Article from './components/Article'
import { MyProvider } from './AudioContext';
import Player from './components/Player'
function App() {

  const [articles, setArticles] = useState<ArticleData[]>([])
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const newArticles = await fetchPage(pageIndex);
      if (newArticles.length === 0) {
        setAllArticlesLoaded(true);
      }
      setArticles([...articles, ...newArticles]);
    }
    if (!allArticlesLoaded) {
      fetchData();
    }
  }, [pageIndex]);






  const listRef = useRef<HTMLDivElement | null>(null);

  const onScroll = async () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

      if (isNearBottom) {
        console.log("Reached bottom");
        setPageIndex(pageIndex + 1);
      }
    }
  };

  useEffect(() => {
    const listElement = listRef.current;
    console.log(listElement)
    if (listElement) {
      listElement.addEventListener("scroll", onScroll);

      // Clean-up
      return () => {
        listElement.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll]);

  return (
    <MyProvider>
      <div className="App">
        <div>
          <h1>RahvusHääling</h1>
          <p>Tere tulemast RahvusHäälingusse. Kuula ERR-i uudiseid meie ilusas eesti keeles.
            Loetud TartuNLP kõnesünteesi mudelite poolt!
          </p>
        </div>
        <div style={{ overflow: 'auto', height: '78vh' }} ref={listRef}>

          {articles.map((article) => (
            <Article
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
            />
          ))}

        </div>


        <Player />
      </div>
    </MyProvider>
  );
}

export default App;
