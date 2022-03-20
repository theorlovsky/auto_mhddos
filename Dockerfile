FROM ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest

RUN apk add --update --no-cache npm
WORKDIR /auto_mhddos
COPY package*.json tsconfig.json ./
RUN npm ci --production
COPY start.ts start.ts

ENTRYPOINT ["npm", "start", "--"]
