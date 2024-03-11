#!/bin/bash

sudo cp -f ~/bits/services/system/* /etc/systemd/system/
echo "Watchtower: Service files updated"

sudo systemctl daemon-reload
echo "Watchtower: Service daemon reloaded"

echo "Watchtower: Restarting services: "
while IFS= read -r service; do
    sudo systemctl restart "$service.service"
    echo " - restarted $service"
done < <(jq -r '.services[]' ~/bits/services/services.json)
echo "Watchtower: Restarted all services"
