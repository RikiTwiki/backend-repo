#!/bin/bash
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

# Добавление переменных для логина и пароля
username="rikitwiki"  # или ваше имя пользователя, если оно отличается
password="rikitwiki"  # измените на ваш пароль

until PGPASSWORD=$password psql -h "$host" -U "$username" -d "booking" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd