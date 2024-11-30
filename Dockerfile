FROM m.daocloud.io/node:lts-slim

ARG npm_config_registry=https://registry.npmjs.org/
ENV npm_config_registry=${npm_config_registry}

LABEL MAINTAINER=https://github.com/Soontao/RSSHub
ENV NODE_ENV=production
ENV TZ=Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN ln -sf /bin/bash /bin/sh

WORKDIR /app

COPY .npmrc package.json package-lock.json /app/

RUN npm ci --include prod

COPY packages /app/packages

EXPOSE 1200

CMD ["node", "packages/rss-server"]
