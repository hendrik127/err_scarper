from sqlmodel import SQLModel, create_engine, Field, Column, JSON
from typing import Optional, List
from dotenv import load_dotenv
import os


load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

if os.getenv('ENVIRONMENT') == 'production':
   DATABASE_URL = os.getenv("DATABASE_URL")
else:
    DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)


class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    link: int
    title: str
    timestamp: str
    author: str
    editor: str
    source: str
    content: List[str] = Field(sa_column=Column(JSON))


class ArticleAudio(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    audio: Optional[bytes]
    index: int
    article_id: Optional[int] = Field(default=None, foreign_key="article.id")


def create_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == '__main__':
    create_tables()
