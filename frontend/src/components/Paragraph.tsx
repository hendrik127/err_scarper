
import React, { useState } from 'react';
import { Box } from '@mui/system';
import PlayButton from './PlayButton';

interface ParagraphProps {
  text: string;
  p_id: number;
  isPlaying: boolean;
  handlePlayButtonClick: (arg: number) => void;
}

function Paragraph(props: ParagraphProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Handle play/pause button click
  const togglePlay = () => {
    // Call the parent component's function to toggle play state
    props.handlePlayButtonClick(props.p_id);
  };

  return (
    <Box
      sx={{
        p: 2,
        transition: 'background-color 0.3s ease-in-out',
        backgroundColor: props.isPlaying || isHovered ? '#333' : 'transparent',
        color: props.isPlaying || isHovered ? '#fff' : 'inherit',
        '&:hover': {
          backgroundColor: props.isPlaying ? '#333' : '#666',
          color: props.isPlaying ? '#fff' : '#fff',
        },
        display: 'flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p>{props.text}</p>
      <PlayButton
        isPlaying={props.isPlaying}
        onClick={togglePlay}
      />
    </Box>
  );
}

export default Paragraph;
