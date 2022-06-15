FROM python:3.8-slim-buster

WORKDIR /usr/src/app

RUN pip install beautifulsoup4 lxml requests waitress flask

COPY main.py scanner.py .

ENTRYPOINT ["waitress-serve", "--port=5000", "--call", "main:main"]