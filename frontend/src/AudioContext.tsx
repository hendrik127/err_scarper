// MyContext.tsx
import { createContext, useContext, useState } from 'react';
import { fetchArticleSound } from './data/sound';
type MyProviderProps = {
  children: React.ReactNode;
};

// Define the type for the context value
type MyContextValue = {
  src: string;
  paragraph: number | undefined;
  setParagraph: (arg: number) => void;
  handleNewArticle: (article: number, length: number) => void;
  handleParagraph: (article: number, paragraph: number) => void
  handleNext: () => void;
  handlePrevious: () => void;

};

type ArticleIndexToParagraphAudioSource = {
  [key: number]: string[];
};

export const MyContext = createContext<MyContextValue | undefined>(undefined);
// Create a provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {


  const [mapArticleToParagraph, setMapArticleToParagraph] = useState<ArticleIndexToParagraphAudioSource>({});
  const [article, setArticle] = useState(-1);
  const [paragraph, setParagraph] = useState(-1);
  const [src, setSrc] = useState('');


  console.log("STATE CHANGED")
  console.log("article", article)
  console.log("paragraph", paragraph)






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

    if (!mapArticleToParagraph[articleIndex][paragraphIndex]) {
      const controller = new AbortController();
      const signal = controller.signal;
      fetchArticleSound(articleIndex, paragraphIndex, signal).then(articleSound => {
        const src = URL.createObjectURL(articleSound);
        setArticle(articleIndex);
        setParagraph(paragraphIndex);
        setSrc(src);
        setMapArticleToParagraph((prevMap) => {
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
      setArticle(articleIndex);
      setParagraph(paragraphIndex);
      setSrc(mapArticleToParagraph[articleIndex][paragraphIndex])
    }
  }

  const handleNext = () => {
    const nextParagraph = paragraph + 1;
    console.log(nextParagraph, "next paragraph")

    if (nextParagraph < (mapArticleToParagraph[article]?.length || 0)) {
      //setParagraph(nextParagraph);
      handleParagraph(article, nextParagraph);
    }

  }
  const handlePrevious = () => {
    const previousParagraph = paragraph - 1;
    if (paragraph > 0) {
      // setParagraph(previousParagraph);
      handleParagraph(article, previousParagraph);
    }

  }

  return (
    <MyContext.Provider
      value={{
        src,
        paragraph,
        setParagraph,
        handleNewArticle,
        handleParagraph,
        handleNext,
        handlePrevious
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
