
// AudioController.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchArticleSound } from './data/sound';
interface AudioContextType {
  audioUrl: string | null;
  isPlaying: boolean;
  playAudio: (index: number, index2: number) => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudioContext(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioControllerProvider');
  }
  return context;
}

interface AudioControllerProviderProps {
  children: ReactNode;
}

export function AudioControllerProvider({ children }: AudioControllerProviderProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState([-1, -1]);
  const playAudio = (index: number, index2: number) => {
    console.log("PLAYING AUDIO")
    fetchArticleSound(index, index2)
      .then((blob) => {
        // Create a URL for the blob data
        const blobUrl = URL.createObjectURL(blob);
        setAudioUrl(blobUrl);
      })
      .catch((error) => {
        console.error('Error fetching audio:', error);
      });
    setCurrentIndex([index, index2]);

    setIsPlaying(true);
  };

  const stopAudio = () => {
    setAudioUrl(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{ audioUrl, isPlaying, playAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  );
}
