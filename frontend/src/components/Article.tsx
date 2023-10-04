import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import {Card, CardActionArea, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Paragraph from './Paragraph';
import { useMyContext } from '../AudioContext';
import { fetchParagraphs } from '../data/paragraphs';
interface ArticleProps {
  id: number;
  title: string;
}

function Article(props: ArticleProps) {

  const context = useMyContext();
  const [expanded, setExpanded] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([])
  const handleExpandClick = async () => {
    setExpanded(!expanded);
    if (!expanded) {
      console.log("Setting article,", props.id)
      context.setArticle(props.id)
      context.setParagraph(0)
    }

  };

  useEffect(()=>{
    if(expanded && paragraphs.length===0){
      fetchParagraphs(props.id).then(
        data => {
          setParagraphs(data)
        }
      )
    }
  },[expanded])



  const content = (
    <CardContent sx={{ justifyContent: 'space-between', display: 'flex' }}>

      <Typography >
        {props.title}
      </Typography>
      <ExpandMoreIcon
        style={{
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease-in-out',
        }}
      />
    </CardContent >
  );

  return (

    <Card variant="outlined">

      <CardActionArea onClick={handleExpandClick}>
        {content}

      </CardActionArea>
      <Collapse in={expanded}>
        <CardContent >
          {
            paragraphs.map((paragraph, inx) => <Paragraph
              article={props.id}
              key={`${props.id}-${inx}`}
              text={paragraph} p_id={inx}
            />)

          }
        </CardContent>
      </Collapse>
    </Card >
  );
}


export default Article
