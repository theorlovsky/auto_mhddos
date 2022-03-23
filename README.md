### 👉 [Українська](./README.uk.md)

### 👉 [Русский](./README.ru.md)

# [auto_mhddos](https://github.com/theorlovsky/auto_mhddos) is an automation tool for [mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy)

It is a run-and-forget tool that periodically fetches
the [targets](https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets)
from [Ukrainian Reaper DDoS](https://t.me/ukrainian_reaper_ddos) and launches attacks on them.

## Installing

Install Docker from the [official site](https://docs.docker.com/get-docker/) or using some other guide.

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

#### `--parallel 3`, `--parallel all`

Default: `1`

How many targets to attack at once. Pass `all` to run attacks on all active targets.

#### `--restart-interval 1h`

Default: `30m`

Minimum: `15m`

How much time to wait before stopping running attacks, re-fetching targets and starting new attacks. Supports `m` (
minutes), `h` (hours) and `d` (days).

#### `--debug false`

Default: `true`

Whether to print logs.

#### Supports all other params from the [mhddos_proxy's docs](https://github.com/porthole-ascend-cinnamon/mhddos_proxy#usage) (except targets and `-c`)
