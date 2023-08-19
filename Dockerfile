FROM python:3.11
# 
WORKDIR /code
# 
COPY ./requirements.txt /code/requirements.txt
# 
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt
# 
COPY ./main.py  /code/
COPY ./database.py /code/
COPY ./database.db /code/
COPY ./scrape.py /code/
# 
CMD ["python3", "database.py"]
# 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
