
import CardContent from '@mui/material/CardContent';
import { Card } from '@mui/material';

interface ArticleProps {
  title: string;
  content: string;
}

function Article(props: ArticleProps) {

  const content = (
    <CardContent>{props.title}</CardContent>
  );
  return (
    <Card variant="outlined">{content}</Card>
  );
}


export default Article
