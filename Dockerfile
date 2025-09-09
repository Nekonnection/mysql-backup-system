FROM node:lts-alpine

RUN apk add --no-cache mysql-client

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run compile

CMD [ "npm", "run", "start" ]