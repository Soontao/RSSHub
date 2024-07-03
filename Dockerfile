FROM node:20.15.0-slim

LABEL MAINTAINER https://github.com/Soontao/RSSHub
ENV NODE_ENV production
ENV TZ Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN ln -sf /bin/bash /bin/sh

WORKDIR /app

COPY .npmrc package.json package-lock.json /app/

RUN npm ci --include prod

COPY lib /app/lib

EXPOSE 1200

CMD ["node", "lib/index.js"]
