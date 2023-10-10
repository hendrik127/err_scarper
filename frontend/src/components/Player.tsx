import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder
import { useEffect, useState, useRef } from 'react';
import { Paper,Slider, Grid, IconButton, Switch } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
import { fetchArticleSound } from '../data/sound';

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trackLength, setTrackLength] = useState(0);
  const [autoplay, setautoplay] = useState(false);
  const context = useMyContext()
  const [currentTime, setCurrentTime] = useState(0);
  const [src, setSrc] = useState("");
  const [srcArray, setSrcArray] = useState<string[]>([]);
  const handleAutoplay = () => {
    setautoplay(!autoplay)
  }

  const handlePrevious = () => {
    setCurrentTime(0);

    togglePause();
    if (context.paragraph === 0) {
      context.setParagraph(0);
    }
    else {
      if(context.paragraph!==undefined)
        context.setParagraph(context.paragraph - 1);
    }
  }

  const handleNext = () => {
    setCurrentTime(0);
    if(!autoplay){

    togglePause();
    }
    if(context.paragraph !== undefined)
      context.setParagraph(context.paragraph + 1);
  }

  const playAudio = async (index2: number) => {
    if(index2>=0 && index2< srcArray.length && !srcArray[index2]){
      fetchArticleSound(context.article, index2).then((articleSound) => {
      const src = URL.createObjectURL(articleSound);
      setSrc(src)
      const a = srcArray;
      a[index2] = src
      setSrcArray(a);
    })
    }else if(index2>=0 && index2< srcArray.length ){
      setSrc(srcArray[index2]);
    }
  }
  const getNext = async (index: number) => {
    if(''===srcArray[index] && index>=0 && index < srcArray.length){
fetchArticleSound(context.article, index).then((articleSound) => {
      const src = URL.createObjectURL(articleSound);  
      const a = srcArray;
      a[index] = src
      setSrcArray(a);
    })

    }
              
}

useEffect(()=>{
    if(context.paragraphsLen){
    setSrc("");
    setSrcArray( Array.from({ length: context.paragraphsLen }, () => ""));}
  },[context.paragraphsLen, context.article])


  useEffect(() => {
    if(context.paragraph!==undefined && srcArray) {

      

      playAudio(context.paragraph)
    }
  }, [ context, srcArray])

  useEffect(() => {
    const audio = audioRef.current;

    
    if (audio) {

const handleLoadedMetadata = () => {
        setTrackLength(audio.duration);
    }
const handleTimeUpdate = () => {

        setCurrentTime(audio.currentTime);
      }
const handlePlay = () => {
      if(context.paragraph!==undefined){

      getNext(context.paragraph+1);
        
      }

    }
      const handleEnded = () => {
        
        if(autoplay){
          handleNext()
        }
      }
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('play', handlePlay);

      audio.addEventListener('ended', handleEnded);

return () => {
    const audio = audioRef.current;
    if (audio) {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
    }
  };

      }}, [context, srcArray, autoplay]);
  
const isTouchScreenDevice = () => {
    try{
        document.createEvent('TouchEvent');
        return true;
    }catch(e){
        return false;
    }
}


  const togglePlay = () => {

    const audio = audioRef.current;
      if (audio && src !== '') {
        audio.play();
      setIsPlaying(true);
    }
  }

 const togglePause = () => {

    const audio = audioRef.current;
     if (audio && src !== '') {
        audio.pause();
      setIsPlaying(false);
    }

        
  }
    

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

  return (
    <Paper sx={{ padding: "2vw", position: "fixed", width: "100vw", bottom: "0" }} className="audio-player">
      <audio autoPlay={autoplay} ref={audioRef} src={src}></audio>
      <Grid container >

        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end" >
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

            <Switch
              onChange={handleAutoplay}
              checked={autoplay}
            />


          </Grid>

        </Grid>

        <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center" >

          <Grid item xs={isTouchScreenDevice() ? 10 : 8}>

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

            {src&&`${Math.floor(currentTime / 60)}:${(currentTime % 60).toFixed(0).padStart(2, '0')} / ${Math.floor(
              trackLength / 60
            )}:${(trackLength % 60).toFixed(0).padStart(2, '0')}`}

          </Grid>

          <Grid item xs={2}>
           { !isTouchScreenDevice() && <Slider
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              aria-labelledby="continuous-slider"
            />}

          </Grid>
        </Grid>

      </Grid >
    </Paper >
  );
};

export default AudioPlayer;
