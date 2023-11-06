import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder
import { useEffect, useRef, useState } from 'react';
import { Paper, Grid, IconButton, Slider } from '@mui/material';
import {
  PlayArrow, Pause, SkipNext, SkipPrevious,
  // SkipPrevious, SkipNext 
} from '@mui/icons-material';
// import { fetchArticleSound } from '../data/sound';

const AudioPlayer = () => {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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



  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setVolume(newValue);
      if (audioRef.current) {
        audioRef.current.volume = newValue;
      }
    }
  };





  useEffect(() => {

    console.log(context.paragraph, "ctx paragraph")
    // Set up the event listener for the audio 'ended' event

    const handlePlay = () => {
      togglePlay();
    }
    const handleEnded = () => {
      context.handleParagraph(context.article, context.paragraph + 1)
    }
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
  }, [context]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      if (audio) {

        setDuration(audio.duration);
      }
    };
    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      };
    }

    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);

    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [audioRef?.current?.HAVE_METADATA, audioRef.current?.readyState]);




  const isTouchScreenDevice = () => {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (context.loading) {
      togglePause()
    }
  }, [context.loading])



  const handleSeekChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      if (audioRef.current) {
        audioRef.current.currentTime = newValue;
      }
    }
  };

  return (
    <Paper
      sx={{ padding: '2vw', position: 'fixed', width: '100vw', bottom: '0' }}
      className="audio-player"
    >
      <audio ref={audioRef} autoPlay={!context.loading} src={context.loading ? '' : context.src}></audio>


      <Grid container>
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end">
          <Grid justifyContent="center">
            <IconButton onClick={() => context.handleParagraph(context.article, context.paragraph - 1)}>
              <SkipPrevious />
            </IconButton>

            <IconButton onClick={isPlaying ? togglePause : togglePlay}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton onClick={() => context.handleParagraph(context.article, context.paragraph + 1)}>
              <SkipNext />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">

          <Grid item xs={isTouchScreenDevice() ? 10 : 8}>
            <Slider
              size="small"
              value={currentTime}
              min={0}
              max={duration}
              step={1}
              onChange={handleSeekChange}
              aria-labelledby="seek-slider"
            />
          </Grid>

          <Grid xs={1} sx={{ fontSize: '10px' }} item>
            {!context.loading &&
              `${Math.floor(currentTime / 60)}:${(currentTime % 60)
                .toFixed(0)
                .padStart(2, '0')} / ${Math.floor(duration / 60)}:${(duration % 60)
                  .toFixed(0)
                  .padStart(2, '0')}`}
          </Grid>
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