
# .env variables are assumed to be loaded already
include .env
export

DB_CONTAINER_NAME=postgres_db

.PHONY: up down create-db logs

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

create-db:
	docker exec -u postgres $(DB_CONTAINER_NAME) \
	psql -c "CREATE DATABASE $(DATABASE_NAME);" || echo "Database might already exist."
