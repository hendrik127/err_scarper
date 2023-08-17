import requests
from bs4 import BeautifulSoup
import re
from sqlmodel import Session, select
from database import Article, engine


def scrape_data(all):
    print("AAALLLLL", all)
    result = []
    URL = "https://www.err.ee/"

    response = requests.get(URL)
    soup = BeautifulSoup(response.content, "html.parser", fromEncoding='utf-8')

    links = soup.find_all("a", href=True)
    links = [link["href"] for link in links]
    pattern = re.compile(r'^\/\/www\.err\.ee\/\d{10}')
    id_pattern = re.compile(r'\d{8,}')
    if not all:
        session = Session(engine)
    links = set(links)
    for link in links:
        if re.search(pattern, link):
            id = int(re.search(id_pattern, link).group())
            if not all:
                stmt = select(Article).where(Article.link == id)
                res = session.exec(stmt)
                if res.first():
                    continue
            article_link = "https:" + link
            print(article_link)
            article = requests.get(article_link)
            article_soup = BeautifulSoup(
                article.content, "html.parser", fromEncoding='utf-8')
            article_title = article_soup.find("header").text
            article_text = article_soup.find(
                "div",
                class_=["text", "flex-row"]).text
            article_author = article_soup.find("div", class_="byline").text
            if article_author == "":
                article_author = "NULL"

            try:
                article_editor = article_soup.find(
                    "p", class_="editor").find("span").text
            except Exception:
                article_editor = "NULL"
            try:
                article_source = article_soup.find(
                    "p", class_="source").find("span").text
            except Exception:
                article_source = "NULL"

            article_time = article_soup.find("time")['datetime']
            # print(article_link, article_time)
            # print("Autor: " + article_author, ", Toimetaja: " +
            #      article_editor, ", Allikas: " + article_source)
            # print()
            # print(article_text)
            # print("##########################################")
            result.append(
                {"link": id,
                    "title": article_title,
                    "timestamp": article_time,
                    "author": article_author,
                    "editor": article_editor,
                    "source": article_source,
                    "content": article_text
                 }
            )
    if not all:
        session.close()
    return result
