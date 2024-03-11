#!/bin/bash

sudo cp -f ~/bits/services/system/* /etc/systemd/system/
echo "Watchtower: Service filed updated"

sudo systemctl daemon-reload
echo "Watchtower: Service daemon reloaded"

while IFS= read -r service; do
    sudo systemctl restart "$service.service"
done < <(jq -r '.services[]' ~/bits/services/services.json)
echo "Watchtower: Restarted all services"
