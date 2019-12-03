# ------------------------------------------------------------------------------
# Development image
# ------------------------------------------------------------------------------

# Create the container from the alpine linux image
FROM node:10.16.3-alpine

RUN apk update && \
    apk add --no-cache build-base && \
    apk add --no-cache yarn python g++ make && rm -rf /var/cache/apk/*

WORKDIR /app 

COPY Makefile .

COPY package.json ./
COPY yarn.lock ./

RUN yarn install