# Build stage
FROM node:14-alpine as build-stage

WORKDIR /docs

# Copy package json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN ls -la

RUN npm run compile

# final-stage
FROM nginx:stable-alpine as production-stage

WORKDIR /docs

RUN ls -la

COPY --from=build-stage /docs/lib /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]