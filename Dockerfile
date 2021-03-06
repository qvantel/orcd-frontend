FROM grafana/grafana:4.1.1

EXPOSE 3000

WORKDIR QvantelFrontend/

COPY config/etc/ /etc/grafana/
COPY config/lib/config_grafana.db /var/lib/grafana/grafana.db
COPY geomap_panel/dist/ /var/lib/grafana/plugins/geomap_panel/
COPY heatmap_panel/dist/ /var/lib/grafana/plugins/heatmap_panel/
COPY cassandra_health_panel/dist/ /var/lib/grafana/plugins/cassandra_health_panel/
