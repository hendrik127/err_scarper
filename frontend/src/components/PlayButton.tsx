
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { margin } from '@mui/system';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PlayButton = (props: PlayButtonProps) => {
  return (
    <IconButton
      sx={{

        marginLeft: 'auto',
      }}
      onClick={props.onClick} >
      {props.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton >
  );
};

export default PlayButton;
