import { fetchArticleSound } from '../data/sound';
import Collapse from '@mui/material/Collapse';
import { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { Button, Card } from '@mui/material';
import { useState } from 'react';
import Paragraph from './Paragraph';
import AudioPlayer from 'react-audio-player'
import PlayButton from './PlayButton';
interface ArticleProps {
  id: number;
  title: string;
  content: string[];
}

function Article(props: ArticleProps) {

  console.log("AA", props.id)

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [currentArticleIndex, setCurrentArticleIndex] = useState(-1);
  const [playAll, setPlayAll] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  const playAllArticles = async () => {
    setExpanded(true);
    setCurrentArticleIndex(0);
    setPlayAll(true);

    const contentLength = props.content.length;
    for (let currentIndex = 0; currentIndex < contentLength; currentIndex++) {
      console.log(currentIndex);
      const articleSound = await fetchArticleSound(props.id, currentIndex);

      if (articleSound) {
        await new Promise((resolve) => {
          audio.current = new Audio(URL.createObjectURL(articleSound));
          audio.current.onended = () => {
            resolve(currentIndex); // Resolve with the current index
          };
          audio.current.play();
        });
      } else {
        break;
      }

      setCurrentArticleIndex(currentIndex + 1);
    }

    setPlayAll(false);
  };
  useEffect(() => {
    const audioElement = audio.current;

    if (audioElement) {

      const l = () => {
        console.log("ENEDE")
        setCurrentArticleIndex(-1);

      }
      //audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('ended', l);
    }

    // Cleanup the event listeners when the component unmounts
    return () => {
      if (audioElement) {
        //audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('ended', handlePause);
      }
    };
  }, [audio]);


  const handlePause = () => {

  }
  const playParagraph = async (index: number) => {
    audio.current?.pause();
    audio.current = null;
    setCurrentArticleIndex(-1)
    handlePause()
    if (currentArticleIndex !== index) {

      const articleSound = await fetchArticleSound(props.id, index);
      setCurrentArticleIndex(index);
      if (articleSound) {
        await new Promise((resolve) => {
          audio.current = new Audio(URL.createObjectURL(articleSound));
          audio.current.onended = () => {
            resolve(index); // Resolve with the current index
          };
          audio.current.play();
        });
      } else {


      }
    }

  };



  const paragraphsItems = props.content.map((paragraphContent, inx) => <Paragraph handlePlayButtonClick={playParagraph} isPlaying={currentArticleIndex === inx}
    key={Number(Math.random() * 10000)} text={paragraphContent} p_id={inx} />);

  interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const content = (
    <CardContent sx={{ display: "flex" }}>
      {props.title}
      <PlayButton
        isPlaying={playAll}
        onClick={playAllArticles} />
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}>
        <ExpandMoreIcon />
      </ExpandMore>
    </CardContent>
  );

  return (
    <Card variant="outlined">{content}
      <Collapse in={expanded}>
        <CardContent>
          {paragraphsItems}</CardContent>
      </Collapse>
    </Card >
  );
}


export default Article
