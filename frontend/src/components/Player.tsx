
import { width } from '@mui/system';
import React from 'react';
import AudioPlayer from 'react-audio-player';
import { useMyContext } from '../AudioContext';
import '../style/App.css'; // Create this CSS file in the same folder

function CustomAudioPlayer() {

  const context = useMyContext();
  const link = context.link
  return (
    <AudioPlayer
      id="player"
      src={link}
      controls
      autoPlay={true} // Set this to true if you want auto-play
      onEnded={context.playNext}
    />
  );
}

export default CustomAudioPlayer;
