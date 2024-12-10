# Используем официальное Ubuntu изображение как базовое
FROM ubuntu:20.04

# Установка Node.js и PostgreSQL Client
RUN apt-get update && apt-get install -y curl postgresql-client
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Установка часового пояса
ENV TZ=Asia/Bishkek
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

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