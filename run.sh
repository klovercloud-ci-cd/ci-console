#!/bin/bash

echo '[INFO] Starting Config Initialization'

find /usr/src/app/public/main*.js -type f -exec sed -i 's@V1_AUTH_ENDPOINT@'"$V1_AUTH_ENDPOINT"'@' {} +
find /usr/src/app/public/main*.js -type f -exec sed -i 's@V1_API_ENDPOINT@'"$V1_API_ENDPOINT"'@' {} +
find /usr/src/app/public/main*.js -type f -exec sed -i 's@V1_API_ENDPOINT_WS@'"$V1_API_ENDPOINT_WS"'@' {} +

echo '[INFO] Config Initialization Completed'

node  /usr/src/app/index.js
#echo '[INFO] Starting Nginx'
#
#nginx -g 'daemon off;'
#sleep 1000000
