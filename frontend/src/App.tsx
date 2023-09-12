import { useRef, useEffect, useState, useMemo, createContext } from 'react';
import { fetchArticles, ArticleData } from './data/articles'
import Article from './components/Article'
import { fetchArticleSound } from './data/sound';
import { useMyContext } from './AudioContext';
import { MyProvider } from './AudioContext';
import ReactAudioPlayer from 'react-audio-player';
import Player from './components/Player'
function App() {

  const [articles, setArticles] = useState<ArticleData[]>([])
  useEffect(() => {
    async function fetchData() {
      const articles = await fetchArticles();
      setArticles(articles);
    }
    fetchData();
  }, []);






  const articlesMemo = useMemo(() => {
    // Use the fetched articles if available, or a default empty array
    return articles.length > 0 ? articles : [];
  }, [articles]);


  return (
    <MyProvider>
      <div className="App">
        <div>
          <h1>RahvusHääling</h1>
          <p>Tere tulemast RahvusHäälingusse. Kuula ERR-i uudiseid meie ilusas eesti keeles.
            Loetud TartuNLP kõnesünteesi mudelite poolt!
          </p>
        </div>

        <div>

          {articlesMemo.map((article) => (
            <Article
              key={article.id}
              id={article.id}
              title={article.title}
              content={article.content}
            />
          ))}

        </div>

        <Player />      </div>
    </MyProvider>
  );
}

export default App;
