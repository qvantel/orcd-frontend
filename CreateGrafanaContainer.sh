#!/bin/bash
if [[ $1 == "" ]]; then
    name="grafana"
else
    name=$1
fi

if [[ $OSTYPE == *"darwin"* ]]; then
    docker run -d --name $name -p 3000:3000  -v /Users/admin/grafana:/var/lib/grafana \
    grafana/grafana
else
    docker run -d --net=host --name $name -p 3000:3000  -v /var/lib/grafana:/var/lib/grafana \
    grafana/grafana
fi
