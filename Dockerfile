FROM grafana/grafana

EXPOSE 3000

WORKDIR QvantelFrontend/

COPY config/etc/ /etc/grafana/
COPY config/lib/config_grafana.db /var/lib/grafana/grafana.db
COPY geomap_panel/dist/ /var/lib/grafana/plugins/geomap_panel/
COPY qvantel-heatmap-panel/dist/ /var/lib/grafana/plugins/qvantel-heatmap-panel/
