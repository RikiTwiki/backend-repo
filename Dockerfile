# Используем официальное Node.js изображение как базовое
FROM node:16

RUN apt-get update && apt-get install -y postgresql-client

ENV TZ=Asia/Bishkek

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта в контейнер
COPY . .

COPY ./scripts/wait-for-postgres.sh ./scripts/

RUN chmod +x ./scripts/wait-for-postgres.sh

# Открываем порт для приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["./scripts/wait-for-postgres.sh", "db", "node", "server.js"]