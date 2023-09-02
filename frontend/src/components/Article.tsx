
import Collapse from '@mui/material/Collapse';

import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import { Card } from '@mui/material';
import { useEffect, useState } from 'react';

interface ArticleProps {
  title: string;
  content: string;
}

function Article(props: ArticleProps) {



  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const content = (
    <CardContent>{props.title}</CardContent>
  );

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



  return (
    <Card variant="outlined">{content}

      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
      >
        <ExpandMoreIcon />
      </ExpandMore>
      <Collapse in={expanded}>

        <CardContent>{props.content}</CardContent>
      </Collapse>



    </Card>
  );
}


export default Article
