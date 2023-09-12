// MyContext.tsx
import React, { useEffect, createContext, useContext, useState } from 'react';
import { fetchArticleSound } from './data/sound';
// Create a context
// Define the type for MyProvider props
type MyProviderProps = {
  children: React.ReactNode;
}



// Define the type for the context value
type MyContextValue = {
  myData: HTMLAudioElement;
  setMyData: React.Dispatch<React.SetStateAction<HTMLAudioElement>>;
  handleAudio: (arg: number, arg1: number) => void
  isPlaying: (arg: number, arg1: number) => boolean
  link: string | undefined
  playNext: () => void

};


export const MyContext = createContext<MyContextValue | undefined>(undefined);
// Create a provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [myData, setMyData] = useState<HTMLAudioElement>(new Audio());
  const [index, setIndex] = useState([-1, -1]);
  const [link, setLink] = useState<string | undefined>(undefined);

  const isPlaying = (index1: number, index2: number) => {
    return index[0] === index1 && index[1] === index2;

  }

  const playNext = () => {
    setIndex(prev => [prev[0], prev[1] + 1])

    playAudio(index[0], index[1] + 1);


  }

  const handleAudio = async (index1: number, index2: number) => {

    setIndex([index1, index2])

    playAudio(index1, index2);
  }





  const playAudio = async (index1: number, index2: number) => {
    //audio.current = null;
    myData?.pause();
    let articleSound = null;
    try {

      articleSound = await fetchArticleSound(index1, index2);
    }
    catch {

      setLink("")
      return

    }
    console.log(articleSound);
    const audio = new Audio(URL.createObjectURL(articleSound));
    setMyData(audio);
    if (audio.hasAttribute("src")) {

      const link = audio.getAttribute("src");
      if (link !== undefined && link !== null) {

        setLink(link)
      }
    }
  }



  return (
    <MyContext.Provider value={{ playNext, link, isPlaying, myData, setMyData, handleAudio }}>
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



