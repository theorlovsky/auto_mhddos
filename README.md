# [auto_mhddos](https://github.com/theorlovsky/auto_mhddos) is an automation tool for [mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy)

It is a run-and-forget tool that periodically fetches
the [targets](https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets)
from [Ukrainian Reaper DDoS](https://t.me/ukrainian_reaper_ddos) and launches attacks on them.

## Installing

Install Docker from the [official site](https://docs.docker.com/get-docker/) or using some other guide.

NOTE: depending on the installation method, you might or might not need to run docker commands as a
root (`sudo docker run ...`).

## Usage

### Basic

```shell
docker run -it --rm --pull always ghcr.io/theorlovsky/auto_mhddos:latest
```

This will run a container in a foreground with all the default parameters (1 simultaneous attack, 1000 threads per CPU
core, 10 minute interval before fetching new targets).

### Configuration

Additionally, you can pass several parameters when running a container:

#### `--parallel 3` or `--parallel all`

How many unique targets to attack at once. Lower limit is 1, upper limit is a number of targets.
`all` runs attacks on all active targets.

#### `--restart-interval 1h`

How much time to wait before stopping running attacks, re-fetching targets and starting new attacks. Supports `m` (minutes), `h` (hours) and `d` (days). Can't
be less than 15 minutes. Default is 30 minutes.

#### `--debug false`

Shows output in a console. Enabled by default.

#### `--disable-parallel-limit`

**WARNING**: use at your own risk.

Allows any number of parallel attacks.

#### `-t`, `--rpc` and other available params see in the [mhddos_proxy's docs](https://github.com/porthole-ascend-cinnamon/mhddos_proxy#usage)

### Running in the background

Running a container in the foreground is good, but then you're unable to do anything in this terminal window and can't close it. There is a better option, especially for any kind of VPS.

```shell
docker run -it -d --restart unless-stopped --pull always --name auto_mhddos ghcr.io/theorlovsky/auto_mhddos:latest
```

This will run a container in the background and will automatically start it again if you restart your machine.

#### But what about `--debug`?

We keep you covered. To see what's going on inside, use this command:

```shell
docker logs -f auto_mhddos
```

#### How do I stop it?

And again, here you go:

```shell
docker rm -f auto_mhddos
```
