
import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder

import React, { useEffect, useState, useRef } from 'react';
import { Box, Slider, Grid, IconButton } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeDown, VolumeMute } from '@mui/icons-material';


const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [trackLength, setTrackLength] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('loadedmetadata', () => {
        setTrackLength(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
    }
  }, []);
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setVolume(newValue);
      if (audioRef.current) {
        audioRef.current.volume = newValue;
      }
    }
  };

  const handleSeekChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      if (audioRef.current) {
        audioRef.current.currentTime = newValue;
      }
    }
  };

  const context = useMyContext()

  return (
    <Box className="audio-player">
      <audio ref={audioRef} src={context.link}></audio>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <IconButton onClick={togglePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Grid>
        <Grid item xs={8}>
          <Slider

            size="small"
            value={currentTime}
            min={0}
            max={trackLength}
            step={1}
            onChange={handleSeekChange}
            aria-labelledby="seek-slider"
          />
        </Grid>

        <Grid item xs={1}>

          {`${Math.floor(currentTime / 60)}:${(currentTime % 60).toFixed(0).padStart(2, '0')} / ${Math.floor(
            trackLength / 60
          )}:${(trackLength % 60).toFixed(0).padStart(2, '0')}`}

        </Grid>
        <Grid item xs={1}>
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            aria-labelledby="continuous-slider"
          />
        </Grid>
      </Grid >
    </Box >
  );
};

export default AudioPlayer;
