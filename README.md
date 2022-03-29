### 👉 [Українська](./README.uk.md)

### 👉 [Русский](./README.ru.md)

# [auto_mhddos](https://github.com/theorlovsky/auto_mhddos) is an automation tool for [mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy)

This tool periodically fetches
the [targets](https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets)
from the [Ukrainian Reaper DDoS](https://t.me/ukrainian_reaper_ddos) community and launches attacks on them. You don't need to manually restart a container.

## Installing

Install Docker:

- [Windows](https://docs.docker.com/desktop/windows/install/)
- [Linux](https://docs.docker.com/engine/install/#server)
- [Mac](https://docs.docker.com/desktop/mac/install/)

NOTE: depending on the installation method, you might or might not need to run docker commands as a
root (`sudo docker run ...`).

## Usage

### Run in background

```shell
docker run -dit --name auto_mhddos --restart unless-stopped --pull always ghcr.io/theorlovsky/auto_mhddos:latest
```

### See logs

```shell
docker logs -f auto_mhddos
```

### Stop

```shell
docker rm -f auto_mhddos
```

### Configuration

Additionally, you can pass several parameters when running a container:

#### `--parallel 2`

Default: `1`

How many parallel attacks to run at once. It's better to increase it incrementally (`1`, `2`, `3`) while monitoring your CPU and Memory usage to find the optimal value.

#### Supports all other params from the [mhddos_proxy's docs](https://github.com/porthole-ascend-cinnamon/mhddos_proxy#usage) (except targets and `-c`)

### Example

```shell
docker run -dit --name auto_mhddos --restart unless-stopped --pull always ghcr.io/theorlovsky/auto_mhddos:latest --parallel 2 -t 2000 --rpc 1000
```
