FROM python:3.11-slim
# 
WORKDIR /code
# 
COPY ./requirements.txt /code/requirements.txt
#
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt
# 
COPY ./main.py  /code/
COPY ./database.py /code/
COPY ./scrape.py /code/

