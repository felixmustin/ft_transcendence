FROM node:latest

RUN apt-get update -y && apt-get install vim -y

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

## EXPOSE [Port you mentioned in the vite.config file]

EXPOSE 3000

CMD ["npm", "run", "dev"]