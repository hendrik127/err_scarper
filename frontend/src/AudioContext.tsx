// MyContext.tsx
import React, { createContext, useContext, useState } from 'react';
type MyProviderProps = {
  children: React.ReactNode;
}

// Define the type for the context value
type MyContextValue = {
  article: number
  setArticle: (arg: number) => void
  paragraph: number|undefined
  setParagraph: (arg: number) => void
  paragraphsLen: number
  setParagraphsLen: (arg: number) => void
};


export const MyContext = createContext<MyContextValue | undefined>(undefined);
// Create a provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [article, setArticle] = useState(0);
  const [paragraph, setParagraph] = useState<number|undefined>(undefined);
  const [paragraphsLen, setParagraphsLen] = useState<number>(0);

  console.log(paragraphsLen)
  return (
    <MyContext.Provider value={{
      article, setArticle,
      paragraph, setParagraph, paragraphsLen, setParagraphsLen
    }}>
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



