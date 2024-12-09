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

# Убедимся, что скрипты находятся в нужном месте и имеют права на выполнение
COPY ./scripts/wait-for-postgres.sh ./scripts/
RUN chmod +x ./scripts/wait-for-postgres.sh
RUN ls -la ./scripts/ # Это поможет убедиться, что скрипт существует и исполняем

# Открываем порт для приложения
EXPOSE 3000

# Указываем абсолютный путь к скрипту в CMD
CMD ["/usr/src/app/scripts/wait-for-postgres.sh", "db", "node", "server.js"]