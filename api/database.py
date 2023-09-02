from sqlmodel import SQLModel, create_engine, Field
from typing import Optional
from dotenv import load_dotenv
import os


load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
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
    content: str


class ArticleAudio(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    audio: Optional[bytes]


def create_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == '__main__':
    create_tables()
