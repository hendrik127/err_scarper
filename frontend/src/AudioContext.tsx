// MyContext.tsx
import { createContext, useContext, useState } from 'react';
import { fetchArticleSound } from './data/sound';
type MyProviderProps = {
  children: React.ReactNode;
};

// Define the type for the context value
type MyContextValue = {
  src: string;
  paragraph: number;
  article: number;
  loading: boolean;
  setParagraph: (arg: number) => void;
  handleNewArticle: (article: number, length: number) => void;
  handleParagraph: (article: number, paragraph: number) => void
};

type ArticleIndexToParagraphAudioSource = {
  [key: number]: string[];
};

export const MyContext = createContext<MyContextValue | undefined>(undefined);
// Create a provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {


  const [mapArticleToParagraph, setMapArticleToParagraph] = useState<ArticleIndexToParagraphAudioSource>({});
  const [article, setArticle] = useState(-1);
  const [paragraph, setParagraph] = useState(0);
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [abortControllers, setAbortControllers] = useState<AbortController[]>([])



  // console.log("STATE CHANGED")
  // console.log("article", article)
  // console.log("paragraph", paragraph)






  const handleNewArticle = (articleIndex: number, length: number) => {
    setArticle(articleIndex);
    // setParagraph(0);
    if (!mapArticleToParagraph[articleIndex]) {
      const newMap = mapArticleToParagraph;
      newMap[articleIndex] = Array.from({ length }, () => '');
      setMapArticleToParagraph(newMap);
    }

    console.log(mapArticleToParagraph);
  }

  const handleParagraph = async (articleIndex: number, paragraphIndex: number) => {

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

    // Create a new AbortController
    // Store the new AbortController in the ref

    console.log("Handlin paragraph", articleIndex, paragraphIndex)
    setArticle(articleIndex)
    setParagraph(paragraphIndex)
    if (!mapArticleToParagraph[articleIndex][paragraphIndex]) {
      setLoading(true);

      fetchArticleSound(articleIndex, paragraphIndex, controller.signal).then(articleSound => {
        if (!articleSound) {
          return;
        }
        const src = URL.createObjectURL(articleSound);

        setSrc(src);
        setMapArticleToParagraph((prevMap) => {
          setLoading(false);
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
      setSrc(mapArticleToParagraph[articleIndex][paragraphIndex])
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
