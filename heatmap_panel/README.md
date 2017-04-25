<p align="center">
  <img src="images/logo_HeatMap.svg" alt="Heatmap logo"/>
</p>

## HeatMap Panel plugin for Grafana
This plugin visualises available products. This is done by using the D3 Javascript library to render each product. The product data is retrieved from a Graphite data source.

There is also a graph representing a timeline, where you more specifically can see the popularity of the products for the selected products.

### How to use
When initiating the plugin into your dashboard and if the data source is selected you'll see a representation of all available products.

Each product is visualised by a filled white-circle surrounded by a white outline in a circle shape aswell.
The inner circle indicates the data that is streaming into the shape. The size is determined by a value property from the data source.

The maximum value is based on what each product is currently showing, meaning that each entity is independent and isolated from other ones. This means that each product will be determined by using its own scale-range. The minimum value in other hand is always counted as 0.

You can select or deselect products by left-clicking on a specific product with your mouse. The selected products will be displayed in the top left corner, but more important, the selected products will be presented in the timeline graph showing the popularity of each product. When a product is selected and is displayed on the graph, the product will be colored dynamically both in the graph plugin and the heat map plugin. This helps the user to know what entities are are shown in the timeline graph when selecting products.

You can also see in the top left corner options to select or deselect services. Selecting specific services will let you filter the data by services, the currently available services are roaming calls via Dataplanextra, Dataplannormal and Dataplanworld.

#### Trends
Each product has a trend icon beside the product name. This is set by default. The trend is calculated by the very first value (since the time when the first data was fetched under the a session), with the last value retrieved.

 There are 3 different trend-values;
 Up-stream: The trend is positive,
 Down-stream: The trend is negative,
 Neutral: There is no actual trend (value is the same as the previous value).

#### Time-lapse
Time-laps is a tool inbuilt in the plugin. The tool provides functionality to watch how products has change under a certain time.
To get the time laps work you have to set a new time range option. When this is done the start button to play the time-laps can be started.

This tool provides different use cases scenarios i.e. monitoring abnormal activities, watching how products are going, monitoring new products and so on.

###Templating
We're using templates as it provides a good way of sharing data between plugins. A template is a variable accessable by all the panels in a dashboard. For this plugin, we're going to use 2 of them, one for services and one for products. The heatmap plugin will use the services variable and the timeline will use both. You will only need to add the service template, as the heatmap plugin will dynamically add the template variable for the products.

In order to setup the services template you'll first need to find the **cogwheel** in the top menu of the dashboard, clicking on this will reveal a menu which includes the option **Templating**, select this option. Find the green **New** button and press it, it will direct you to where you add a new template variable. For the **Name**, we're going to add **services** and for the **Label** we'll put **Services**. The name is a kind of ID for the template and the label is just a name. As for the **Type**, we're going to select **Custom** as it will let you enter specific values. In the **Custom Options** section, we'll add: **Dataplanextra, Dataplannormal, Dataplanworlde**. In the **Selection Options** we're going to enable both **Multi-value** (which enables ous to multi select products) and **Include All option**.

###Metrics
To get the plugin working, a data source is required. This is done by setting up a data source. The data source is needed to fetch current values from available products to display each product a representative way.
The plugin does only support a Graphite data source, other data sources may need to be configured.

To setup a data source, take a look on the readme-file [documentation](https://github.com/flygare/QvantelFrontend#data-source-setup).

#### Graphite query setup
When you have setup your Graphite data source, you'll need to go into the **Metrics** tab to alter the Graphite query, you'll need an admin account in order to see this tab.

#### Setting up the timeline graph
Follow the same instructions from the **Metrics** section to add the data source. Make sure to set the correct template variable, in this case **$products**. The graph will handle everything automatically.
