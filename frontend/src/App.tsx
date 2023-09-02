import { useEffect, useState } from 'react';
import { fetchArticles, ArticleData } from './data/articles'
import Article from './components/Article'
function App() {

  const [articles, setArticles] = useState<ArticleData[]>([])

  useEffect(() => {
    async function fetchData() {
      const articles = await fetchArticles();
      setArticles(articles);
    }
    fetchData();
  }, [])

  return (
    <div className="App">
      <div>

        {articles.map((article) => (
          <Article
            key={article.id}
            id={article.id}
            title={article.title}
            content={article.content}
          />
        ))}

      </div>
    </div>
  );
}

export default App;
