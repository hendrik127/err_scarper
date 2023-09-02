from fastapi.responses import StreamingResponse
import io
import json
from typing import Dict
import httpx
from fastapi import FastAPI, HTTPException, Depends
from pydantic import parse_obj_as
from scrape import scrape_data
from typing import List
from sqlmodel import Session, select
from database import Article, ArticleAudio, engine
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class TextToSpeech(BaseModel):
    text: str
    speaker: str
    speed: float


TEXT_TO_SPEECH_URL = "https://api.tartunlp.ai/text-to-speech/v2"


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
    TEXT_TO_SPEECH_URL
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
    # Check whether the database is empty.
    # If empty, seed with all articles that can be found.
    # If not empty, add all articles that have not been added.
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
    # Fetch new articles that are not in the database yet.
    # Add them to the database.
    scrape(False)
    return {"sync": "complete"}


@app.get("/sort")
async def sort() -> List[Article]:
    # Get all the articles from the database sorted by date.
    with Session(engine) as session:
        stmt = select(Article).order_by(Article.timestamp.desc())
        articles_by_date = session.exec(stmt).all()
        return articles_by_date


@app.get("/audio/{id}")
async def audio(id: int, speaker: str = "Mari", speed: float = 1.0) -> StreamingResponse:
    headers: Dict = {"Content-Type": "application/json"}
    content_type = "audio/wav"

    text = ""
    with Session(engine) as session:
        stmt = select(Article).where(Article.id == id)
        result = session.exec(stmt)
        article = result.first()
        if not article:
            return b''
        text = article.title
    with Session(engine) as session:
        stmt2 = select(ArticleAudio).where(ArticleAudio.id == id)
        result2 = session.exec(stmt2)
        audio = result2.first()

        if not audio:
            try:
                async with httpx.AsyncClient() as client:
                    body = TextToSpeech(text=text,
                                        speaker=speaker, speed=speed)
                    response = await client.post(TEXT_TO_SPEECH_URL, headers=headers, json=body.dict())
                    # response.raise_for_status()  # Raise an exception if the request fails
                    audio_binary = response.content  # Use response.content as binary audio data
                    audio.audio = audio_binary
                    session.add(audio)
                    session.commit()
            except Exception as e:
                print(e)
        else:
            audio_binary = audio.audio
        return StreamingResponse(io.BytesIO(audio_binary), media_type=content_type)
