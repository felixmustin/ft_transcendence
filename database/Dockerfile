FROM postgres:latest

EXPOSE 5432

COPY ./database-seed.sql /docker-entrypoint-initdb.d/database-seed.sql

