FROM node:trixie-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y mariadb-client-compat --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run compile

CMD [ "npm", "run", "start" ]