FROM ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest

LABEL org.opencontainers.image.source=https://github.com/theorlovsky/auto_mhddos

RUN apk add --update --no-cache npm
WORKDIR /auto_mhddos
COPY package*.json tsconfig.json ./
RUN npm ci --production
COPY lib lib

ENTRYPOINT ["npm", "start", "--"]
