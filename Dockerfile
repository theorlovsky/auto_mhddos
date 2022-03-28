FROM node:16.4-alpine3.14 as builder

WORKDIR /builder
COPY package*.json ./
RUN npm ci
COPY tsconfig.json webpack.config.cjs ./
COPY src src
RUN npx --no-install webpack --mode production

FROM ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest

LABEL org.opencontainers.image.source=https://github.com/theorlovsky/auto_mhddos

RUN apk add --update --no-cache curl nodejs
WORKDIR /auto_mhddos
COPY --from=builder /builder/dist ./

ENTRYPOINT ["node", "main.js"]
