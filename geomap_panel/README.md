## GeoMap Panel plugin for Grafana

This plugin visualizes roaming calls for each country. This is achieved by using the map service from Google GeoCharts. The location data is retrieved from a Graphite data source.

![GeoMap](images/GeoMap_Preview.gif)

### How to use
When loading up the plugin, you'll initially see a world map with colorized countries (if data is present). The color represents the frequency of a countrys roaming calls compared to the other countries currently displayed on the map. 

In the bottom left corner you'll see a legend with a color gradient, a minimum and a maximum value. The color of each country will be determined by using this scale. A country with a frequency closer to the minimum value with recieve a color close to the left hand side of the gradient.

A countrys frequency can be more clearly seen by hovering the mouse hover a specific country, a popup will appear displaying its frequency of roaming calls. A country must have data in order for the popup to show.

### Metrics
In order to retrieve data to the plugin you'll need to setup a Graphite data source. Graphite will need to send a country code and a value for that specific country. The value will represent the frequency of the country.

The plugin will retrieve a set of data points for each country, depending on the time ranged specified within Grafana. As the plugin will sum the value of each data point to its respective country, it's recommended to do let Graphite sum the data points. There are several ways to achieve this, but one way is to let the option **Max data points** to be **1** and then adding the **consolidateBy** function with the **sum** parameter. This basically means that the plugin only wants 1 data source, and the overflow of data points should be summed. You can alter this setting if you instead want the **average**, **min** or **max** value.

For the plugin to work properly, you'll also need to use the **aliasByNode** function to point to the field containing the country code. This will let the plugin easily retrieve the country code.

### Options
