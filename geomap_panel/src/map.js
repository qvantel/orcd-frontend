/** This class will be responsible for loading and drawing the Google GeoCharts map */
export default class Map {
    /**
    * Build the map and set some initiate variables
    */
    constructor (ctrl, container, onReadyCallback) {
        this.ctrl = ctrl;
        this.container = container;
        this.readyCallback = onReadyCallback;
        this.options = {
            region: this.ctrl.getRegion(),
            colorAxis: {
                minValue: 0,
                maxValue: 100,
                colors: [this.ctrl.lightTheme ? '#f5f5f3' : '#151515']
            },
            backgroundColor: {
                'fill': this.ctrl.lightTheme ? '#fbfbfb' : '#1f1d1d'
            },
            datalessRegionColor: this.ctrl.lightTheme ? '#f5f5f3' : '#151515',
            legend: this.getLegend(),
            tooltip: {
                focus: 'focus'
            }
        };
        this.setColors(this.ctrl.panel.colors);
        this.loadGoogle();
    }

    /**
    * This function will make sure Google has been loaded before using it
    */
    loadGoogle () {
        var self = this;

        // If google has yet been loaded, wait 30ms and try again
        if (typeof google === 'undefined') {
            setTimeout(function () {
                self.loadGoogle();
            }, 30);
        } else {
            google.charts.load('upcoming', {'packages': ['geochart']});
            google.charts.setOnLoadCallback(function () {
                self.createMap();
            });
        }
    }

    /**
    * This function will create the actual map and bind some events, when done, initially draw the map
    */
    createMap () {
        var self = this;
        this.map = new google.visualization.GeoChart(this.container);
        google.visualization.events.addListener(this.map, 'ready', function (e) {
            self.ready = true;
            if (self.readyCallback) {
                self.readyCallback();
            }
        });

        this.draw();
    }

    /**
    * This function will draw the map with available data
    */
    draw () {
        this.ready = false;

        // Get data from the controller and store it the way Google expects it
        var data = [['Country', 'Popularity']];
        for (var key in this.ctrl.data) {
            data.push([key, this.ctrl.data[key]]);
        }
        data = google.visualization.arrayToDataTable(data);

        this.map.draw(data, this.options);
    }

    /**
    * Change region to be zoomed into
    *
    * @param {string} region - The region to be zoomed into
    */
    setRegion (region) {
        if (this.options.region !== region) {
            this.options.region = region;
        }
    }

    /**
    * Toggle the legend
    */
    toggleLegend () {
        this.options.legend = this.getLegend();
    }

    /**
    * This function will be responsible for building the legend depending on if the option in the ctrl
    * is set to be using it or not
    */
    getLegend () {
        if (!this.ctrl.panel.showLegend) {
            return 'none';
        }

        return {
            textStyle: {
                'color': this.ctrl.lightTheme ? '#000' : '#fff'
            }
        };
    }

    /**
    * Set which colors to be used for the regions
    */
    setColors (colors) {
        // Reset the color array with the default element
        this.options.colorAxis.colors = [this.options.colorAxis.colors[0]];

        // Set the other colors if available
        for (var i = 0; i < colors.length; i++) {
            this.options.colorAxis.colors[i + 1] = colors[i];
        }
    }
}
