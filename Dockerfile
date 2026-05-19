FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY /frontend/package*.json frontend/
RUN npm install --prefix frontend
COPY .env .
COPY /frontend ./frontend
RUN npm run vite build --prefix frontend


FROM python:3.12-slim AS python-base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY /backend ./backend
COPY main.py .
COPY .env .
COPY config.yml .


FROM python-base AS development
COPY --from=build-frontend /app/static ./static
COPY ./frontend/swagger.css ./static/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


FROM python-base AS production
COPY ./frontend/swagger.css ./static/ 
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
