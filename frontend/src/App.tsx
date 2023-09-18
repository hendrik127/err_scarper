
import { useEffect, useState, useRef } from 'react';
import { ArticleData, fetchPage } from './data/articles'
import Article from './components/Article'
import { MyProvider } from './AudioContext';
import AudioPlayer from './components/Player'
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import './style/App.css'
function App() {

  const [articles, setArticles] = useState<ArticleData[]>([])
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);


  async function fetchData() {
    if ((nearBottom && !loading) || articles.length === 0) {
      setLoading(true);

      await fetchPage(pageIndex + 1).then((newArticles) => {
        console.log("FETCHING")
        if (newArticles.length === 0) {
          setAllArticlesLoaded(true);
        } else {
          setArticles([...articles, ...newArticles])
        }

      }
      ).then(_ => {
        setLoading(false);
        setPageIndex(pageIndex + 1)

      })


    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = async () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const isNearBottom = scrollTop + clientHeight >= (0.8 + (0.01 * pageIndex)) * scrollHeight
        if (isNearBottom) {
          setNearBottom(true)
          console.log("NEAR")
          // console.log(allArticlesLoaded, "all articles")
          // console.log(loading, "loading")
          if (!allArticlesLoaded && !loading) {
            console.log("UF2")
            await fetchData();

          }
        } else {
          if (!allArticlesLoaded) {

            setNearBottom(false);
          }
        }
      }
    };


    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", onScroll);
      return () => {
        listElement.removeEventListener("scroll", onScroll);
      };
    }
  }, [fetchData, loading, allArticlesLoaded]);

  return (
    <MyProvider>
      <div className="App">
        <Box>

          <h1 className='header'>RahvusHääling</h1>
          <p className='header'>Tere tulemast RahvusHäälingusse. Kuula ERR-i uudiseid meie ilusas eesti keeles.
            Loetud TartuNLP kõnesünteesi mudelite poolt!
          </p>
        </Box>
        <div style={{ overflow: 'auto', height: '78vh', justifyItems: 'center' }} ref={listRef}>

          {articles.map((article) => (
            <Article
              key={article.id}
              id={article.id}
              title={String(article.id) + ". " + article.title}
              content={article.content}
            />
          ))}


          {(loading && !allArticlesLoaded) && <Box sx={{ width: '100%', textAlign: 'center' }}><CircularProgress sx={{

            color: 'black',
          }} /></Box>}
          {allArticlesLoaded && <Box sx={{ width: '100%', textAlign: 'center' }} ><h1>...</h1></Box>}
        </div>
        <AudioPlayer />
      </div>
    </MyProvider >
  );
}

export default App
