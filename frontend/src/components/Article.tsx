
import Collapse from '@mui/material/Collapse';

import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { Card } from '@mui/material';
import { useState } from 'react';
import PlayButton from './PlayButton';


interface ArticleProps {
  id: number;
  title: string;
  content: string;
}

function Article(props: ArticleProps) {





  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
      >
        <ExpandMoreIcon />
      </ExpandMore>
    </CardContent>
  );



  return (
    <Card variant="outlined">{content}

      <Collapse in={expanded}>

        <CardContent>{props.content}</CardContent>
        <PlayButton id={props.id}></PlayButton>
      </Collapse>



    </Card >
  );
}


export default Article
