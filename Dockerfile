FROM grafana/grafana

CMD ["QvantelFrontend", "-f"]

EXPOSE 3000

COPY config/etc/ /etc/grafana/
COPY config/lib/ /var/lib/grafana/
COPY geomap_panel/dist/ /var/lib/grafana/plugins/geomap_panel/
