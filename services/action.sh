#!/bin/bash

cp -f ~/bits/services/system/* /etc/systemd/system/

# reload systemd
systemctl daemon-reload

# restart each service
while IFS= read -r service; do
    systemctl restart "$service.service"
done < <(jq -r '.services[]' ~/bits/services/services.json)
