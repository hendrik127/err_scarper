import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder
import { useEffect, useState, useRef } from 'react';
import { Paper,Slider, Grid, IconButton, Switch } from '@mui/material';
import { PlayArrow, Pause, SkipPrevious, SkipNext } from '@mui/icons-material';
import { fetchArticleSound } from '../data/sound';

const AudioPlayer = () => {
  // console.log("PLaYETRR")
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
    // console.log("HANDLIN")
    setCurrentTime(0);
    setIsPlaying(false);
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
    setIsPlaying(false);
    if(context.paragraph !== undefined)
      context.setParagraph(context.paragraph + 1);

  }


  const playAudio = async (index2: number) => {
    // console.log(srcArray)
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
      if(index2+1>0 && index2+1 < srcArray.length && !srcArray[index2+1])
      await getNext(index2+1);
    
  }
  const getNext = async (index: number) => {
    // console.log("GETTIN NEXXT")
    fetchArticleSound(context.article, index).then((articleSound) => {
      const src = URL.createObjectURL(articleSound);  
      const a = srcArray;
      a[index] = src
      setSrcArray(a);


    })
          
}

useEffect(()=>{
    if(context.paragraphsLen){

    setIsPlaying(false);
    togglePlayPause();
    setSrc("");
    setCurrentTime(0);
      // console.log("HAV LEN")
    setSrcArray( Array.from({ length: context.paragraphsLen }, () => ""));}
  },[context.paragraphsLen, context.article])


  useEffect(() => {
    if(context.paragraph!==undefined && srcArray) {
setIsPlaying(false);
    togglePlayPause();
    setSrc("");
    setCurrentTime(0);
      playAudio(context.paragraph)
    }
  }, [srcArray, context])

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
        if(context.paragraph!==undefined)
        context.setParagraph(context.paragraph + 1)
      });
    }
  }, [context]);
  
const isTouchScreenDevice = () => {
    try{
        document.createEvent('TouchEvent');
        return true;
    }catch(e){
        return false;
    }
}
  const togglePlayPause = () => {
    const audio = audioRef.current;
    // console.log(audio);
    if (audio && src !== '') {
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
    <Paper sx={{ padding: "2vw", position: "fixed", width: "100vw", bottom: "0" }} className="audio-player">
      <audio autoPlay={autoplay} ref={audioRef} src={src}></audio>
      <Grid container >

        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="flex-end" >
          <Grid justifyContent="center">

            <IconButton onClick={handlePrevious}>
              <SkipPrevious />
            </IconButton>

            <IconButton onClick={togglePlayPause}>
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
