FROM node:20-alpine AS build

WORKDIR /app

COPY /frontend ./frontend
RUN npm install --prefix frontend && npm run vite build --prefix frontend

FROM python:3.12-slim

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY /backend ./backend
COPY --from=build /app/static ./static
COPY /tests ./tests
COPY main.py .
COPY pytest.ini .
COPY .env .
COPY config.yml .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
