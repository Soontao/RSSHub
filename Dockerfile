FROM node:lts-slim

LABEL MAINTAINER https://github.com/Soontao/RSSHub

ENV NODE_ENV production
ENV TZ Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN ln -sf /bin/bash /bin/sh

RUN apt-get update && apt-get install -yq libgconf-2-4 apt-transport-https git --no-install-recommends

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm i -g pnpm

RUN pnpm i

COPY . /app

EXPOSE 1200

CMD ["node", "lib/index.js"]
