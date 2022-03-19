FROM ghcr.io/porthole-ascend-cinnamon/mhddos_proxy:latest

RUN apk add --update --no-cache npm && npm i -g zx
COPY start start

ENTRYPOINT ["zx", "start"]
