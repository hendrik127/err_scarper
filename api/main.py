from fastapi import FastAPI
from pydantic import parse_obj_as
from scrape import scrape_data
from typing import List
from sqlmodel import Session, select
from database import Article, engine
from fastapi.middleware.cors import CORSMiddleware


def scrape(all: bool) -> List[Article]:
    # Whether to seed empty database or to only get new articles.
    data = scrape_data(all)
    result = parse_obj_as(List[Article], data)
    session = Session(engine)
    for article in result:
        session.add(article)
    session.commit()
    session.close()
    return result


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Check whether database is empty.
    # If empty seed with all articles that can be found.
    # If not empty add all articles that have not been added.
    with Session(engine) as session:
        articles = select(Article)
        result = session.exec(articles).first()
        if not result:
            scrape(True)
        else:
            scrape(False)


@app.get("/")
async def root() -> List[Article]:
    with Session(engine) as session:
        result = session.exec(select(Article)).all()
        return result


@app.get("/sync")
async def sync():
    # Fetches new articles that are not in the database yet.
    # Adds them to the database.
    scrape(False)
    return {"sync": "complete"}


@app.get("/sort")
async def sort() -> List[Article]:
    # Gets all the articles from the database sorted by date.
    with Session(engine) as session:
        stmt = select(Article).order_by(Article.timestamp.desc())
        articles_by_date = session.exec(stmt).all()
        return articles_by_date
