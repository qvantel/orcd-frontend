# Cassandra Health Metrics dashboard
Cassandra Health Metrics dashboard provides you with an overview performance visualization of your server.
Predefined dashboard currently displays:
- Memory usage
- CPU performance usage
- Disk space usage
- Amount of CDR's generated

## Screenshots

![image of import](src/img/dashboard.png)
![image of dashboardCPU](src/img/dashboardCPU.png)
![image of dashboardDiskSpace](src/img/dashboardDiskGauge.png)
![image of dashboardCDR](src/img/dashboardCDR.png)

## Plugins
Cassandra Health Metrics dashboard uses 2 existing plugins.
Usage over time are displayed in [Graphby Grafana Labs](https://grafana.com/plugins/graph) while current value of data displays in [D3 Gaugeby Brian Gann](https://github.com/briangann/grafana-gauge-panel)

### Modifications
[D3 Gaugeby Brian Gann](https://github.com/briangann/grafana-gauge-panel) only supports to define maximum value statically. When displaying disk space where the total disk space differs from server to server defining the maximum value of the gauge static is not an option. We modified the ctrl.js file so when 2 metrics are defined the last metric are the maximum value of the gauge.

Example 2 metrics:
- server->disk->usage
- server->disk->total - Will represent maximum value of gauge.

When only 1 metric is defined the gauge will automatically set the value 100 as it's maximum value. This is used when displaying CPU usage where the maximum value of a CPU is 100%.

## Installation

### Dashboard
We have exported an default dashboard into cassandraHealthDashboard.json, the file provides you with an existing dashboard.

Follow these steps to import cassandraHealthDashboard.json:
1. Clone [cassandraHealthDashboard.json](https://github.com/flygare/QvantelFrontend/blob/cassandrahealth/grafana-gauge-panel/cassandraHealthDashboard.json)
2. Import cassandraHealthDashboard.json

![image of import](src/img/import.png)

3. Define you custom metrics for each panel.

### Resource script
To reach and push data dynamically every second to Grafana we have created a script called [resourceUsageCassandra.sh](https://github.com/flygare/QvantelFrontend/blob/cassandrahealth/grafana-gauge-panel/resourceUsageCassandra.sh). The script pushes data into Cassandra.

Follow these steps to run resourceUsageCassandra.sh
1. Clone [resourceUsageCassandra.sh](https://github.com/flygare/QvantelFrontend/blob/cassandrahealth/grafana-gauge-panel/resourceUsageCassandra.sh)
2. Run script > bash resourceUsageCassandra.sh
