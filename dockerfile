FROM node:22.8.0-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 4000

CMD [ "npm","run","serve" ]