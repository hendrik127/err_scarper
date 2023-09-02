
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import { fetchArticleSound } from '../data/sound';
interface PlayButtonProps {
  id: number;
}

const PlayButton = (props: PlayButtonProps) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<'stopped' | 'playing' | 'paused' | 'finished'>('stopped');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newAudio = new Audio();
    newAudio.addEventListener('ended', handleAudioEnded);
    setAudio(newAudio);

    return () => {
      newAudio.removeEventListener('ended', handleAudioEnded);
    };
  }, []);

  const handleAudioEnded = () => {
    setAudioState('finished');
  };

  const handlePlayClick = async () => {
    if (audioState === 'stopped' || audioState === "finished") {
      setIsLoading(true);
      try {
        const soundBlob = await fetchArticleSound(props.id);

        const soundUrl = URL.createObjectURL(soundBlob); // Create a URL for the Blob
        audio!.src = soundUrl;
        audio!.play();
        setAudioState('playing');
      } catch (error) {
        console.error('Error fetching sound:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (audioState === 'playing') {
      audio!.pause();
      setAudioState('paused');
    } else if (audioState === 'paused') {
      audio!.currentTime = 0; // Reset to the beginning
      audio!.play();
      setAudioState('playing');
    }
  };

  return (
    <IconButton onClick={handlePlayClick} disabled={isLoading}>
      {isLoading ? <PlayArrowIcon /> : (
        <>
          {audioState === 'stopped' && <PlayArrowIcon />}
          {audioState === 'playing' && <PauseIcon />}
          {audioState === 'paused' && <PlayArrowIcon />}
          {audioState === 'finished' && <ReplayIcon />}
        </>
      )}
    </IconButton>
  );
};

export default PlayButton;
