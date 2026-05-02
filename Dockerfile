FROM node:20-alpine AS build

FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY /frontend ./frontend
RUN npm install --prefix frontend && npm run build --prefix frontend

COPY /backend ./backend
COPY /tests ./tests
COPY main.py .
COPY pytest.ini .
COPY .env .
COPY config.yml .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
