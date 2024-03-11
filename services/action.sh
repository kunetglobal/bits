#!/bin/bash

sudo cp -f ~/bits/services/system/* /etc/systemd/system/

# reload systemd
sudo systemctl daemon-reload

# restart each service
while IFS= read -r service; do
    sudo systemctl restart "$service.service"
done < <(jq -r '.services[]' ~/bits/services/services.json)
