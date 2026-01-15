FROM python:3.12-slim
WORKDIR /frontend
COPY . .
CMD ["python", "-m", "http.server", "80", "--bind", "0.0.0.0"]