from fastapi import FastAPI
from pydantic import parse_obj_as
from scrape import scrape_data
from typing import List
from sqlmodel import Session, select
from database import Article, engine


def scrape(all):
    data = scrape_data(all)
    result = parse_obj_as(List[Article], data)
    session = Session(engine)
    for article in result:
        session.add(article)
    session.commit()
    session.close()


app = FastAPI()


@app.on_event("startup")
def on_startup():
    with Session(engine) as session:
        articles = select(Article)
        result = session.exec(articles).first()
        if not result:
            scrape(True)
        else:
            scrape(False)
            print("FUUCK")


@app.get("/")
async def root():
    with Session(engine) as session:
        result = session.exec(select(Article)).all()
        return result
