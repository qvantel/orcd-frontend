#!/bin/bash
if [[ $1 == "" ]]; then
    name="grafana_dev"
else
    name=$1
fi

docker stop $name
docker rm $name
npm run build

if [[ $OSTYPE == *"darwin"* ]]; then
    docker run -d --name $name -p 3001:3000  \
    -v $HOME/Qvantel/QvantelFrontend/config/lib:/var/lib/grafana \
    -v $HOME/Qvantel/QvantelFrontend/config/etc:/etc/grafana \
    -v $HOME/Qvantel/QvantelFrontend/geomap_panel/:/var/lib/grafana/plugins/geomap_panel \
    -v $HOME/Qvantel/QvantelFrontend/heatmap_panel/:/var/lib/grafana/plugins/heatmap_panel \
    grafana/grafana
else
    docker run -d --net=host --name $name -p 3001:3000 \
    -v $HOME/Qvantel/QvantelFrontend/config/lib:/var/lib/grafana \
    -v $HOME/Qvantel/QvantelFrontend/config/etc:/etc/grafana \
    -v $HOME/Qvantel/QvantelFrontend/geomap_panel/:/var/lib/grafana/plugins/geomap_panel \
    -v $HOME/Qvantel/QvantelFrontend/heatmap_panel/:/var/lib/grafana/plugins/heatmap_panel \
    grafana/grafana
fi
