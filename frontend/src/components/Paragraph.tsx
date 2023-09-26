import { useState, useRef, useEffect } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false)
  const handleButtonClick = async () => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    context.setArticle(props.article);
    context.setParagraph(props.p_id)
  }

  useEffect(() => {
    const p = () => { return context.article === props.article && context.paragraph === props.p_id }
    setIsPlaying(p());

    if (p()) {

      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

  }
    , [context]
  )
  const ref = useRef<HTMLButtonElement | null>(null);

  if (isPlaying) {

    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return (

    <Box ref={ref} onClick={handleButtonClick}
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
    </Box>
  );
}

export default Paragraph;
