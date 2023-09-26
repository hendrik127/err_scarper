import Collapse from '@mui/material/Collapse';
import { memo } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { useState } from 'react';
import Paragraph from './Paragraph';
import { useMyContext } from '../AudioContext';
interface ArticleProps {
  id: number;
  title: string;
  content: string[];
}

function Article(props: ArticleProps) {

  // console.log("AA", props.id)

  const context = useMyContext();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = async () => {
    setExpanded(!expanded);
    if (!expanded) {
      console.log("Setting article,", props.id)
      context.setArticle(props.id)
      context.setParagraph(0)
    }

  };



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
            props.content.map((paragraphContent, inx) => <Paragraph
              article={props.id}
              key={`${props.id}-${inx}`}
              text={paragraphContent} p_id={inx}
            />)

          }</CardContent>
      </Collapse>
    </Card >
  );
}


export default Article
