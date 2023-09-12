import { useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useMyContext } from '../AudioContext';

import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
interface ParagraphProps {
  text: string;
  p_id: number;
  article: number
}

function Paragraph(props: ParagraphProps) {

  const context = useMyContext();
  const [isHovered, setIsHovered] = useState(false);

  const handleButtonClick = async () => {
    context.handleAudio(props.article, props.p_id);

    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }



  const isPlaying = context.isPlaying(props.article, props.p_id);

  const ref = useRef<HTMLButtonElement | null>(null);

  if (isPlaying) {

    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return (

    <Box
      sx={{
        p: 2,
        transition: 'background-color 0.3s ease-in-out',
        backgroundColor: isPlaying || isHovered ? '#234' : 'transparent',
        color: isPlaying || isHovered ? '#fff' : 'inherit',
        '&:hover': {
          backgroundColor: isPlaying ? '#234' : '#666',
          color: isPlaying ? '#fff' : '#fff',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>{props.text}</p>
      <IconButton ref={ref} onClick={handleButtonClick} style={{ color: 'black' }} >
        {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
      </IconButton>
    </Box>
  );
}

export default Paragraph;
