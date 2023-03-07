FROM node:12

RUN apt-get update -y && apt-get install vim -y

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
