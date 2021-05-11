# Build stage
FROM node:14-alpine as build-stage

WORKDIR /web

# Copy package json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN ls -la

RUN npm run compile


# production stage
## FROM nginx:stable-alpine as production-stage

## WORKDIR /web

## COPY --from=build-stage /web/lib /usr/share/nginx/html

## EXPOSE 80

##CMD ["nginx", "-g", "daemon off;"]
