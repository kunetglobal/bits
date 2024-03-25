#!/bin/bash

cd ~/bits/
git pull
echo "Watchtower: Pulled latest changes"

sudo systectl restart restart.service
echo "Watchtower: Restarted all services"