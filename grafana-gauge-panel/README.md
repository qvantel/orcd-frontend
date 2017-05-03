# Cassandra Health Metrics dashboard
Cassandra Health Metrics dashboard provides you with an overview performance visualization of your server.
Predefined dashboard currently displays:
- Memory usage
- CPU performance usage
- Disk space usage
- Amount of CDR's generated

## Screenshots

## Plugins
Cassandra Health Metrics dashboard uses 2 existing plugins. Usage over time are displayed in [Graphby Grafana Labs](https://grafana.com/plugins/graph) while current value of data displays in [D3 Gaugeby Brian Gann](https://github.com/briangann/grafana-gauge-panel)

#### Modifications
[D3 Gaugeby Brian Gann](https://github.com/briangann/grafana-gauge-panel) only supports to define maximum value statically. When displaying disk space where the total disk space differs from server to server defining the maximum value of the gauge static is not an option. We modified the ctrl.js file so when 2 metrics are defined the last metric are the maximum value of the gauge.
Example 2 metrics:
- server->disk->usage
- server->disk-total - Will represent maximum value of gauge.

When one 1 metrics is defined the gauge will automatically set the value 100 as it's maximum value. This is used when displaying CPU usage.
