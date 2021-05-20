# FROM-key defines the origin of the image to be used.
FROM node:14-alpine
# FROM node:16-alpine
# RUN npm install -g npm@7.12.1

# Directory
WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install --production

COPY ./public ./public
COPY ./config ./config
COPY ./lib .

EXPOSE 3030

CMD npm start 