// MyContext.tsx
import { createContext, useContext, useState } from 'react';
import { fetchArticleSound } from './data/sound';
type MyProviderProps = {
  children: React.ReactNode;
};

type MyContextValue = {
  src: string;
  paragraph: number;
  article: number;
  loading: boolean;
  setParagraph: (arg: number) => void;
  handleNewArticle: (article: number, length: number) => void;
  handleParagraph: (article: number, paragraph: number, play: boolean) => void
};

type ArticleIndexToParagraphAudioSource = {
  [key: number]: string[];
};

export const MyContext = createContext<MyContextValue | undefined>(undefined);
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {

  const [mapArticleToParagraph, setMapArticleToParagraph] = useState<ArticleIndexToParagraphAudioSource>({});
  const [article, setArticle] = useState(-1);
  const [paragraph, setParagraph] = useState(-1);
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [abortControllers, setAbortControllers] = useState<AbortController[]>([])

  const handleNewArticle = (articleIndex: number, length: number) => {
    if (!mapArticleToParagraph[articleIndex]) {
      const newMap = mapArticleToParagraph;
      newMap[articleIndex] = Array.from({ length }, () => '');
      setMapArticleToParagraph(newMap);
    }
  }

  const handleParagraph = async (articleIndex: number, paragraphIndex: number, play: boolean) => {
    if (paragraphIndex >= mapArticleToParagraph[articleIndex].length || paragraphIndex < 0) {
      return;
    }
    if (abortControllers.length > 0) {
      while (abortControllers.length > 0) {
        const controller = abortControllers.pop()
        if (controller) {
          controller.abort();
        }
      }

    }
    const controller = new AbortController();

    setAbortControllers([controller]);
    if (play) {
      setArticle(articleIndex)
      setParagraph(paragraphIndex)

    }
    if (!mapArticleToParagraph[articleIndex][paragraphIndex]) {
      if (play) {
        setLoading(true);
      }
      fetchArticleSound(articleIndex, paragraphIndex, controller.signal).then(articleSound => {
        if (!articleSound) {
          return;
        }
        const src = URL.createObjectURL(articleSound);
        if (play) {
          setSrc(src);
        }

        setMapArticleToParagraph((prevMap) => {
          if (play) {
            setLoading(false);
          }
          const newArray = prevMap[articleIndex];
          newArray[paragraphIndex] = src;
          return {
            ...prevMap,
            articleIndex: newArray,
          };
        });
      }).catch((error) => {
        // Handle errors here if needed
        console.error('Error in then block:', error);
      });

    } else {
      if (play) {
        setSrc(mapArticleToParagraph[articleIndex][paragraphIndex])
      }
    }
  }

  return (
    <MyContext.Provider
      value={{
        src,
        paragraph,
        article,
        loading,
        setParagraph,
        handleNewArticle,
        handleParagraph,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to access the context
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
