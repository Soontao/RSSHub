FROM node:lts-slim

LABEL MAINTAINER https://github.com/Soontao/RSSHub
ENV NODE_ENV production
ENV TZ Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN ln -sf /bin/bash /bin/sh

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app

EXPOSE 1200

CMD ["node", "lib/index.js"]
