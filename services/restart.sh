#!/bin/bash

cd ~/bits/

sudo cp -f ~/bits/services/system/* /etc/systemd/system/
echo "Watchtower: Service files updated"

sudo systemctl daemon-reload
echo "Watchtower: Service daemon reloaded"

echo "Watchtower: Restarting all services"
script_dir=$(dirname "$0")
for service_file in "$script_dir/system/"*.service; do
    file=$(basename "$service_file" .service)

    if [ "$file" != "restart" ]; then
        sudo systemctl restart "$file.service"
        sudo systemctl enable "$file.service"
        sudo systemctl start "$file.service"
        echo " - restarted $file"
    fi

done
echo "Watchtower: Restarted all services"
