import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { useEffect, useState, useRef, useMemo } from 'react';
import { ArticleData, fetchPage } from './data/articles';
import Article from './components/Article';
import AudioPlayer from './components/Player';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import './style/App.css';

function App() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);

  async function fetchData() {
    if ((nearBottom && !loading) || articles.length === 0) {
      setLoading(true);

      await fetchPage(pageIndex + 1)
        .then((newArticles) => {
          if (newArticles.length === 0) {
            setAllArticlesLoaded(true);
          } else {
            setArticles([...articles, ...newArticles]);
          }
        })
        .then(() => {
          setLoading(false);
          setPageIndex(pageIndex + 1);
        });
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
        const isNearBottom = scrollTop + clientHeight >= (0.8 + 0.01 * pageIndex) * scrollHeight;
        if (isNearBottom) {
          setNearBottom(true);
          if (!allArticlesLoaded && !loading) {
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
      listElement.addEventListener('scroll', onScroll);
      return () => {
        listElement.removeEventListener('scroll', onScroll);
      };
    }
  }, [fetchData, loading, allArticlesLoaded]);

  const rendered = useMemo(() => {
    return articles.map((article) => (
      <Article key={article.id} id={article.id} title={String(article.id) + '. ' + article.title} />
    ));
  }, [articles]);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Paper className="header" sx={{ padding: '1rem', borderBottom: 'none' }} elevation={5}>
          <h1>RahvusHääling</h1>
          <p>
            Tere tulemast RahvusHäälingusse. Kuula ERR-i uudiseid meie ilusas eesti keeles. Loetud
            TartuNLP kõnesünteesi mudelite poolt!
          </p>
        </Paper>
        <div style={{ overflow: 'auto', height: '99vh', justifyItems: 'center' }} ref={listRef}>
          {rendered}

          {nearBottom && !allArticlesLoaded && (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <CircularProgress
                sx={{
                  color: 'black'
                }}
              />
            </Box>
          )}
          {allArticlesLoaded && <h1>...</h1>}
        </div>
        <AudioPlayer />
      </div>
    </ThemeProvider>
  );
}

export default App;
