from sqlmodel import SQLModel, create_engine, Field
from typing import Optional


class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    link: int
    title: str
    timestamp: str
    author: str
    editor: str
    source: str
    content: str


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == '__main__':
    create_tables()
