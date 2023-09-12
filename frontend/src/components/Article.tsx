import Collapse from '@mui/material/Collapse';
import { useRef } from 'react';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { Box, Card } from '@mui/material';
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

      context.handleAudio(props.id, 0);
    }

  };

  interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return (<IconButton {...other} />);
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));


  const content = (
    <CardContent sx={{ display: 'flex' }}>
      {props.title}
      < ExpandMore
        expand={expanded}
        onClick={handleExpandClick} >
        <ExpandMoreIcon />
      </ExpandMore >
    </CardContent >
  );

  return (
    <Card variant="outlined">{content}
      <Collapse in={expanded}>
        <CardContent>
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
