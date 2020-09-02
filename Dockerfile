FROM node:12-slim

LABEL MAINTAINER https://github.com/Soontao/RSSHub

ENV NODE_ENV production
ENV TZ Asia/Shanghai
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN ln -sf /bin/bash /bin/sh

RUN apt-get update && apt-get install -yq libgconf-2-4 apt-transport-https git dumb-init --no-install-recommends && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json tools/clean-nm.sh /app/

RUN npm install --production && sh ./clean-nm.sh;

COPY . /app

EXPOSE 1200

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start"]
