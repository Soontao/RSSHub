FROM node:lts-slim

RUN apt update
RUN apt install -y curl

LABEL MAINTAINER=https://github.com/Soontao/RSSHub
ENV NODE_ENV=production
ENV TZ=Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

COPY .npmrc package.json package-lock.json /app/
COPY packages /app/packages

RUN npm ci --include prod --ws

EXPOSE 1200

CMD ["node", "packages/rss-server"]
