import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder
import { createRef, useEffect, useState } from 'react';
import { Paper, Grid, IconButton, Slider, Switch } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
// import { fetchArticleSound } from '../data/sound';

const AudioPlayer = () => {

  const audioRef = createRef<HTMLAudioElement>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  // const [volume, setVolume] = useState(0.5);
  // const [autoplay, setautoplay] = useState(false);
  const context = useMyContext();

  const [volume, setVolume] = useState(0.5);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio?.src) {
      console.log("TOGGLIN")
      audio.play();

      setIsPlaying(true);
    }


  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (audio) {

      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleAutoPlayNext = () => {
    setAutoPlayNext(!autoPlayNext)
  }

  const handlePrevious = () => {
    console.log("PREV")
    togglePause();
    context.handlePrevious();
  };

  const handleNext = () => {
    console.log("NEXT")
    context.handleNext();
  };


  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setVolume(newValue);
      if (audioRef.current) {
        audioRef.current.volume = newValue;
      }
    }
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    console.log(audio, "ENDED")
    if (audio) {
      audio.pause();
    }

    setIsPlaying(false);
    // Audio playback ended, trigger logic to play the next audio
    handleNext();
  };

  const handlePlay = () => {
    togglePlay();
  }

  useEffect(() => {
    // Set up the event listener for the audio 'ended' event
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);

    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
      }
    };
  }, [context.src]);




  const isTouchScreenDevice = () => {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  };



  return (
    <Paper
      sx={{ padding: '2vw', position: 'fixed', width: '100vw', bottom: '0' }}
      className="audio-player"
    >
      <audio ref={audioRef} autoPlay={autoPlayNext} src={context.src}></audio>


      <Grid container>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end">
          <Grid justifyContent="center">
            <IconButton onClick={handlePrevious}>
              <SkipPrevious />
            </IconButton>

            <IconButton onClick={isPlaying ? togglePause : togglePlay}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={handleNext}>
              <SkipNext />
            </IconButton>

            <Switch onChange={toggleAutoPlayNext} checked={autoPlayNext} />

          </Grid>
        </Grid>

        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
          <Grid item xs={2}>
            {!isTouchScreenDevice() && (
              < Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                aria-labelledby="continuous-slider"
              />
            )
            }
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AudioPlayer;


