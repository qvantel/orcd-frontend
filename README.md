[![Build Status](https://travis-ci.com/flygare/QvantelFrontend.svg?token=LSeHcrYCJtK5fMzkMp9s&branch=master)](https://travis-ci.com/flygare/QvantelFrontend)

# Qvantel Frontend
This repository contains Grafana plugins, the included plugins are the GeoMap panel plugin and the Heatmap plugin. Here, we'll also go through how to install the plugins into Grafana, and how to set them up so they properly work. Both plugin supports retrieving data from a Graphite data source. The plugin may work with other data sources, but we can't guarantee nor support it.

## GeoMap panel plugin
The GeoMap panel plugin visualizes roaming calls for each country. This is achieved by using the map service from Google GeoCharts. Each country will recieve a color based on their frequency of roaming calls, the color is determined by a color gradient. If a country has less frequency, it's color will be picked on the left hand side of the gradient. Documentation for this plugin can be found ![here](geomap_panel#geomap-panel-plugin-for-grafana).

![GeoMap Preview](geomap_panel/images/GeoMap_Preview_Dark.gif)

## Heatmap panel plugin
This plugin contains of a heatmap written in D3JS, the heatmap shows how frequent a service is used. Documentation for this plugin can be found ![here](heatmap_panel).

## Plugin installation
To install a plugin, you'll need to download the folder for the wanted plugin found in this repository. If you want to install the GeoMap panel plugin, you need to download the **geomap_panel** folder and if you want to install the Heatmap plugin, you need to download the **heatmap_panel** folder. 

### Manual setup
When you have downloaded the folder you want, move the folder into the **plugins** folder found inside the Grafana directory. Just move the folder manually or execute a command line to do it for you:
```
cp -fr CURRENT_PLUGIN_FOLDER_LOCATION YOUR_GRAFANA_PLUGIN_FOLDER_LOCATION
```
When the folder is in the correct place, you'll need to open up the terminal and navigate the downloaded plugin folder. You will now need to install all the dependencies for the plugin, for this we're using **npm**.
```
npm install
```
Now that we have all the dependencies needed, we will need to build the plugin, this is done using **grunt**.
```
grunt
```

### Automatic setup
This can also be done automatically by executing the **install.sh** script. This script will move the files to the Grafana plugin folder, install dependencies with npm and build the plugin with grunt. The script accepts a location parameter, this parameter will need to point to your Grafanas plugin folder. If the location parameter is not present, it will try to move the folder to **$HOME/grafana/plugins**.
```
./install.sh YOUR_GRAFANA_PLUGIN_FOLDER_LOCATION
```

Note: If you're running Grafana in a docker container, you'll need to restart the container in order for the plugin to show up.

## Dashboard setup
Now that you have installed the plugin, you'll need to setup a dashboard in order to actually display the plugin. To do this, you will need to open up Grafana in your web browser and login to an account with administration access. When you're logged in, you can see a Grafana icon in the top left corner, click the icon and a dropdown will appear. Here you can see several options, but the one we want is the **Dashboards** option, a submenu will appear, here you'll want to navigate to **New**.

You will now see a list of plugins in a horizontal list, locate the plugin you installed and drag and drop it into the panel that says **Empty Space**.

You should now see the plugin displayed inside the panel you dropped the plugin into. You will now need to add a data source in order to retrieve data for the plugin.

## Data source setup
In order for your plugin to retrieve data, you'll need to setup a data source. As mentioned above, we're currently only supporting Graphite as a data source. Other data sources may work, but we can't guarantee it.

To setup a data source, make sure you're logged into an account with administration access and once again click the Grafana icon, but this time, navigate to the **Data Sources** option. 

You can see a button that's labeled **Add data source**, click that button and you'll be redirected to a new page where you can add your data source. 

Fill in your credentials and press the Save & Test button. This will make sure that the credentials you input are correct and that the data source can be found. As mentioned previously, we recommend that you use a Graphite data source. 

When you data source is setup, navigate to the dashboard that contains the plugin that you want to connect the data source to. Again, make sure you're logged into an account with administration access. We'll now need to access the **Metrics** for the dashboard. Click the titel of the dashboard and menu will appear, click the **Edit** option and a new section below the dashboard will appear. You will see a set of tabs (the amount may vary depending on your plugin), but the tab we're currently interested in is the **Metrics** tab. Here, you'll be able to setup the query for your data source, this query will be specific to the plugin you're using.

To setup the Graphite query for the plugin, please see the documentation for the respective plugin: ![GeoMap documentation](geomap_panel#metrics) and ![Heatmap documentation](heatmap_panel#metrics)

## Grafana themes
Grafana also supports different themes, the standard is the dark theme. If you'd rather want a lighter theme you can change it. 

To achieve this, press the Grafan icon to the top left corner, hover your profile and navigate to **Preferences**. Here you can see several sections, but in the **Preferences** section, there is an option called **UI Theme**. Select the theme you prefer and press the **Update** button. The plugin should respond to which theme that is being used by changing it's default color scheme. 
