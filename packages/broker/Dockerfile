# Build stage
FROM node:14-alpine as build-stage

WORKDIR /broker

# Copy package json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN ls -la

RUN npm run compile

# production-stage
FROM node:14-alpine as production-stage

RUN mkdir -p broker/lib

WORKDIR /broker

# Copy package json
COPY package*.json ./

ENV TZ Europe/Brussels

RUN npm install --only=production && npm cache clean --force --loglevel=error

COPY --from=build-stage /broker/lib ./lib

COPY process.yml ./lib

RUN  ls -la

RUN npm i -g pm2

ENTRYPOINT ["pm2-runtime", "./lib/process.yml"]  