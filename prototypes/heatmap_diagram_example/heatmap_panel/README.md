## Heatmap panel

This panel visualizes a set of products.

## How to use
The plugin needs to be uploaded into Grafana. A dashboard is required to initialize the panel into workspace.
Each product is displayed in a box-container to differentiate each entity from each other. A color is specified in a circle aswell.
The different colors in each entity shows a specified value from the range (0-1000).

### Click entity
When clicking on a entity it is saved and displayed on a timeline. This timeline shows more specific what value the product preciously had.
To disable the timeline it is necessary to deselect all entities that has been selected.

### Timeline functions
There is currently one function in the tl. It is possible to start alarms in tl. An alarm is triggered by setting a specific Percent-value and a target. When the value is reached the user gets notified.

## Metrics
The heatmap panel generates datapoints for use in order to display proper data for the user/viewer.
Each datapoint consist of a timestamp, product name and a value which currently is limited from 0 to 1000.
The heatmap panel only handles this range of values.

## Dependency
The panel is currently dependent on the example-fake-datasource plugin.

## Issues
1. Selecting and deselecting product to display timeline. Reloading page is required.