FROM node:carbon-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk add -t .gyp --no-cache git python g++ htop nano make \
    && npm install -g truffle \
    && apk del .gyp