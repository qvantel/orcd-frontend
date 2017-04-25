<p align="center">
  <img src="images/logo_HeatMap.svg" alt="Heatmap logo"/>
</p>

## HeatMap Panel plugin for Grafana
This plugin visualises available products. This is done by using the D3 Javascript library to render each product. The product data is retrieved from a Graphite data source.

There is also a graph representing a timeline, where you more specifically can see the popularity of the products for the selected products.

### How to use
When initiating the plugin into your dashboard and if the data source is selected you'll see a representation of all available products.

Each product is visualised by a filled white-circle surrounded by a gray outline in a circle shape aswell.
The inner circle indicates the data that is streaming into the shape. Each circle's size is determined by a value property from the data source.

The maximum value is based on what each product is currently showing, meaning that each entity is independent and isolated from other ones. This means that each product will be determined by using its own scale-range. The minimum value however is always 0.

<<<<<<< HEAD
You can select or deselect products by left-clicking on a specific product with your mouse. The selected products will be displayed in the top left corner, but more importantly, the selected product will be presented in the timeline graph showing the popularity of each product. When a product is selected and is displayed on the graph, the product will be colored dynamically both in the graph plugin and the heat map plugin. This helps the user to know what entities are are shown in the timeline graph when selecting products.

You can also see in the top left corner options to select or deselect services. Selecting specific services will let you filter the data by services, the currently available services are Champions League Final, Free Facebook, MMS Plan Normal, SMS Plan Normal and Call Plan Normal.

#### Trends
Each product has a trend icon beside the product name. This is set by default. The trend is calculated by the very first value (since the time when the first data was fetched under the a session), with the last value retrieved.

However as we get more real looking data, the trend calculation will change to look more like [Simple linear regression](https://en.wikipedia.org/wiki/Simple_linear_regression)

 There are 5 different trend values;<br>
 **Large up stream**: The trend is increasing by 25% or more.<br>
 **Small up stream**: The trend is increasing between 0,5% to 25%.<br>
 **Large down stream**: The trend is decreasing by 25% or more.<br>
 **Small down stream**: The trend is decreasing between 0,5% to 25%.<br>
 **Neutral**: Trend is going pretty much straight, spanning between +0,5% to -0,5%.

 These values might change as we change trend calculation.

#### Time-lapse
Time-lapse is a tool built into the plugin. The tool provides functionality to watch how products have changed under a certain period of time.
To get the time-lapse work you have to set a new time range option. When this is done press the start button to play the time-lapse.

This tool provides different use case scenarios i.e. monitoring abnormal activities, watching how products are going, monitoring new products and so on.

###Templating
We're using templates as it provides a good way of sharing data between plugins. A template is a variable accessable by all the panels in a dashboard. For this plugin, we're going to use 2 of them, one for services and one for products. The heatmap plugin will use the services variable and the timeline will use both. You will only need to add the service template, as the heatmap plugin will dynamically add the template variable for the products.

In order to setup the services template you'll first need to find the **cogwheel** in the top menu of the dashboard, clicking on this will reveal a menu which includes the option **Templating**, select this option. Find the green **New** button and press it, it will direct you to where you add a new template variable. For the **Name**, we're going to add **services** and for the **Label** we'll put **Services**. The name is a kind of ID for the template and the label is just a name. As for the **Type**, we're going to select **Custom** as it will let you enter specific values. In the **Custom Options** section, we'll add: **Dataplanextra, Dataplannormal, Dataplanworlde**. In the **Selection Options** we're going to enable both **Multi-value** (which enables ous to multi select products) and **Include All option**.

###Metrics
To get the plugin working, a data source is required. This is done by setting up a data source. The data source is needed to fetch current values from available products to display each product a representative way.
The plugin does only support a Graphite data source, other data sources may need to be configured.

To setup a data source, take a look on the readme-file [documentation](https://github.com/flygare/QvantelFrontend#data-source-setup).

#### Graphite query setup
When you have setup your Graphite data source, you'll need to go into the **Metrics** tab to alter the Graphite query. You'll need an admin account in order to see this tab.<br>

```
Our query for the heatmap:
summarize(qvantel.product.$category.*, '$timetype', 'sum', false)

Our query for the graph:
aliasByMetric(summarize(qvantel.product.*.$products, '$timetype', 'sum', false))
```

#### Setting up the timeline graph
Follow the same instructions from the **Metrics** section to add the data source. Make sure to set the correct template variable, in our case **$products**,**$category** and **$timetype**. The graph will handle everything automatically.
