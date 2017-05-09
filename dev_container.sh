#!/bin/bash
if [[ $1 == "" ]]; then
    name="grafana_dev"
else
    name=$1
fi

docker stop $name
docker rm $name


if [[ $OSTYPE == *"darwin"* ]]; then
    if [ ! -e "config/lib/grafana.db" ]; then
        cp config/lib/config_grafana.db config/lib/grafana.db
    fi
    npm run build
    docker run -d --name $name -p 3001:3000  \
    -v $HOME/Qvantel/QvantelFrontend/config/lib/grafana.db:/var/lib/grafana/grafana.db \
    -v $HOME/Qvantel/QvantelFrontend/config/etc:/etc/grafana \
    -v $HOME/Qvantel/QvantelFrontend/geomap_panel/dist/:/var/lib/grafana/plugins/geomap_panel \
    -v $HOME/Qvantel/QvantelFrontend/heatmap_panel/dist/:/var/lib/grafana/plugins/heatmap_panel \
    -v $HOME/Qvantel/QvantelFrontend/cassandra-health-panel/dist/:/var/lib/grafana/plugins/cassandra-health-panel \
    grafana/grafana

else
    sudo chown student:student ../QvantelFrontend -R

    if [ ! -e "config/lib/grafana.db" ]; then
        cp config/lib/config_grafana.db config/lib/grafana.db
        sudo chown student:student config/lib/grafana.db
    fi
    npm run build
    docker run -d --name $name -p 3001:3000 \
    -v $HOME/Qvantel/QvantelFrontend/config/lib/grafana.db:/var/lib/grafana/grafana.db \
    -v $HOME/Qvantel/QvantelFrontend/config/etc:/etc/grafana \
    -v $HOME/Qvantel/QvantelFrontend/heatmap_panel/:/var/lib/grafana/plugins/heatmap_panel \
    -v $HOME/Qvantel/QvantelFrontend/geomap_panel/dist/:/var/lib/grafana/plugins/geomap_panel \
    grafana/grafana

    sudo chown student:student ../QvantelFrontend -R
fi
