
import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder

import React, { useEffect, useState, useRef } from 'react';
import { Paper, Box, Slider, Grid, IconButton, Switch } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp, VolumeDown, VolumeMute } from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
import { argv0 } from 'process';
import { fetchArticleSound } from '../data/sound';

const AudioPlayer = () => {
  console.log("PLaYETRR")
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [trackLength, setTrackLength] = useState(0);
  const [autoplay, setautoplay] = useState(false);
  const context = useMyContext()
  const [currentTime, setCurrentTime] = useState(0);
  const [src, setSrc] = useState("");


  const handleAutoplay = () => {
    setautoplay(!autoplay)
  }

  const playAudio = async (index2: number) => {
    fetchArticleSound(context.article, index2).then((articleSound) => {
      console.log(articleSound);
      const src = URL.createObjectURL(articleSound);
      setSrc(src)
    })
  }

  useEffect(() => {
    playAudio(context.paragraph)
  }, [context])


  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('loadedmetadata', () => {
        setTrackLength(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('play', () => {
        setIsPlaying(true)
      })


      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        context.setParagraph(context.paragraph + 1)
      });
    }
  }, [context]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    console.log(audio);
    if (audio && audio.src.trim() !== '') {
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

  // justifyContent="space-evenly"
  return (
    <Paper sx={{ padding: "2vw", position: "fixed", width: "90vw", bottom: "2vw", marginLeft: "3vw", marginRight: "3vw", border: "solid 2px grey" }} className="audio-player">
      <audio autoPlay={autoplay} ref={audioRef} src={src}></audio>
      <Grid container >

        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end" >
          <Grid justifyContent="center">

            <IconButton >
              <SkipPrevious />
            </IconButton>

            <IconButton onClick={togglePlayPause}>
              {isPlaying ? <Pause style={{ color: 'black' }} /> : <PlayArrow style={{ color: 'black' }} />}
            </IconButton>
            <IconButton >
              <SkipNext />
            </IconButton>

            <Switch
              onChange={handleAutoplay}
              checked={autoplay}
            />


          </Grid>

        </Grid>

        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center" >

          <Grid item xs={9}>

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

          <Grid xs={1} sx={{ fontSize: "10px" }} item>

            {`${Math.floor(currentTime / 60)}:${(currentTime % 60).toFixed(0).padStart(2, '0')} / ${Math.floor(
              trackLength / 60
            )}:${(trackLength % 60).toFixed(0).padStart(2, '0')}`}

          </Grid>

          <Grid item xs={2}>
            <Slider
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              aria-labelledby="continuous-slider"
            />

          </Grid>
        </Grid>

      </Grid >
    </Paper >
  );
};

export default AudioPlayer;
