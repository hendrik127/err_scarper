import { fetchArticleSound } from '../data/sound';
import Collapse from '@mui/material/Collapse';
import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { Button, Card } from '@mui/material';
import { useState } from 'react';
import Paragraph from './Paragraph';
import AudioPlayer from 'react-audio-player'
interface ArticleProps {
  id: number;
  title: string;
  content: string[];
}

function Article(props: ArticleProps) {



  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [currentArticleIndex, setCurrentArticleIndex] = useState(-1);
  const [playAll, setPlayAll] = useState(false);


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
          const audio = new Audio(URL.createObjectURL(articleSound));
          audio.onended = () => {
            resolve(currentIndex); // Resolve with the current index
          };
          audio.play();
        });
      } else {
        break;
      }

      setCurrentArticleIndex(currentIndex + 1);
    }

    setPlayAll(false);
  };


  const paragraphsItems = props.content.map((paragraphContent, inx) => <Paragraph handlePlayButtonClick={setCurrentArticleIndex} isPlaying={currentArticleIndex === inx}
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
      <Button onClick={playAllArticles} >Kuula</Button>
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
