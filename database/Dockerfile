FROM postgres:14.1-alpine

EXPOSE 5432

COPY ./database-seed.sql /docker-entrypoint-initdb.d/database-seed.sql

