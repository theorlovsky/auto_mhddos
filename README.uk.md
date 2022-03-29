### 👉 [English](./README.md)

### 👉 [Русский](./README.ru.md)

# [auto_mhddos](https://github.com/theorlovsky/auto_mhddos) – інструмент для автоматизації роботи [mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy)

Цей інструмент під час роботи періодично буде
підтягувати [цілі](https://raw.githubusercontent.com/Aruiem234/auto_mhddos/main/runner_targets)
від спільноти [Український Жнець](https://t.me/ukrainian_reaper_ddos) та атакувати їх. Вам не потрібно власноруч перезапускати контейнер.

## Встановлення

Встановіть Docker:

- [Windows](https://docs.docker.com/desktop/windows/install/)
- [Linux](https://docs.docker.com/engine/install/#server)
- [Mac](https://docs.docker.com/desktop/mac/install/)

ВАЖЛИВО: в залежності від обраного метода, вам може знадобитися запускати команди докера від імені root
користувача (`sudo docker run ...`).

## Застосування

### Запустити у фоні

```shell
docker run -dit --name auto_mhddos --restart unless-stopped --pull always ghcr.io/theorlovsky/auto_mhddos:latest
```

### Подивитися логи

```shell
docker logs -f auto_mhddos
```

### Зупинити

```shell
docker rm -f auto_mhddos
```

### Налаштування

Додатково можна передати наступні параметри під час запуску контейнера:

#### `--parallel 2`

За замовчуванням: `1`

Скільки запускати одночасних атак. Краще збільшувати це число поступово (`1`, `2`, `3`), дивлячись при цьому на навантаження на процесор та оперативну пам'ять, щоб знайти оптимальне значення.

#### Також підтримуються усі параметри з [документації mhddos_proxy](https://github.com/porthole-ascend-cinnamon/mhddos_proxy#usage) (окрім цілей та `-c`)

### Приклад

```shell
docker run -dit --name auto_mhddos --restart unless-stopped --pull always ghcr.io/theorlovsky/auto_mhddos:latest --parallel 2 -t 2000 --rpc 1000
```
