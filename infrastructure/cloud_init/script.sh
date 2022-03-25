# cloud init script, adopted for auto_mhddos
# works for DO and Vultr
# original credit goes to https://github.com/opengs/uashield

#!/bin/sh

sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    wget

wget -O - https://get.docker.com/ | bash

sudo systemctl enable docker.service
sudo systemctl start docker.service

mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.2.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
sudo chown $USER /var/run/docker.sock

scaling_factor=$(grep -c ^processor /proc/cpuinfo)
sudo echo "
version: \"3.3\"
services:
  uafielder:
    container_name: auto_mhddos
    image: ghcr.io/theorlovsky/auto_mhddos:latest
    restart: unless-stopped
    command:
      - \"--parallel\"
      - \"${scaling_factor}\"" >> /home/docker-compose.yaml

sudo apt install -y docker-compose

cd /home/

sudo docker-compose pull && sudo docker-compose up -d

sudo echo "*/30 * * * * cd /home/ && sudo docker-compose down -t 1 && sudo docker-compose pull && sudo docker-compose up -d" > /home/cronjob

# restart:always should do the job to run container on startup, but the hard restart is good here to avoid problems
sudo echo "@reboot cd /home/ && sudo docker-compose down -t 1 && sudo docker-compose pull && sudo docker-compose up -d" >> /home/cronjob
crontab /home/cronjob
