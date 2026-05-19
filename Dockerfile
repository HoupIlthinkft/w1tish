FROM node:20-alpine AS build

WORKDIR /app

COPY /frontend/package*.json frontend/
RUN npm install --prefix frontend

COPY .env .
COPY /frontend ./frontend
RUN npm run vite build --prefix frontend

FROM python:3.12-slim

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY /backend ./backend
COPY --from=build /app/static ./static
COPY ./frontend/swagger.css ./static/
COPY main.py .
COPY .env .
COPY config.yml .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
