[![Build Status](https://travis-ci.com/flygare/QvantelFrontend.svg?token=LSeHcrYCJtK5fMzkMp9s&branch=master)](https://travis-ci.com/flygare/QvantelFrontend)

# Qvantel Frontend
This repository contains Grafana plugins, the included plugins are the GeoMap panel plugin and the Heatmap plugin. Here, we'll also go through how to install the plugins into Grafana, and how to set them up so they properly work. Both plugin supports retrieving data from a Graphite data source. The plugin may work with other data sources, but we can't guarantee nor support it.

## GeoMap panel plugin
The GeoMap panel plugin visualizes roaming calls for each country. This is achieved by using the map service from Google GeoCharts. Each country will recieve a color based on their frequency of roaming calls, the color is determined by a color gradient. If a country has less frequency, it's color will be picked on the left hand side of the gradient. Documentation for this plugin can be found here: 

![GeoMap](images/GeoMap_Preview_Dark.gif)

## Heatmap panel plugin
This plugin contains of a heatmap written in D3JS, the heatmap shows how frequent a service is used. Documentation for this plugin can be found here: 

## Plugin installation

## Dashboard setup

## Data source setup

## Grafana themes
