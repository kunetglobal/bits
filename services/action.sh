#!/bin/bash

sudo cp -f ~/bits/services/system/* /etc/systemd/system/
echo "Watchtower: Service files updated"

sudo systemctl daemon-reload
echo "Watchtower: Service daemon reloaded"

echo "Watchtower: Restarting services: "

# Iterate over all service files in the system directory
for service_file in "$(dirname "$0")/script_dir/system/"*.service; do
    sudo systemctl restart "$service_file"
    sudo systemctl enable "$service_file"
    sudo systemctl start "$service_file"

    echo " - restarted $service_file"
done
echo "Watchtower: Restarted all services"

