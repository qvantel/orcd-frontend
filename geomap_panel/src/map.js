export default class Map {
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

    loadGoogle () {
        var self = this;
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

    createMap () {
        var self = this;
        this.map = new google.visualization.GeoChart(this.container);
        google.visualization.events.addListener(this.map, 'regionClick', function (e) {
            self.options.region = e.region;
        });
        google.visualization.events.addListener(this.map, 'ready', function (e) {
            self.ready = true;

            if (self.readyCallback) {
                self.readyCallback();
            }
        });

        this.draw();
    }

    draw () {
        this.ready = false;
        var data = [['Country', 'Popularity']];
        for (var key in this.ctrl.data) {
            data.push([key, this.ctrl.data[key]]);
        }
        data = google.visualization.arrayToDataTable(data);

        this.map.draw(data, this.options);
    }

    setRegion (region) {
        if (this.options.region !== region) {
            this.options.region = region;
        }
    }

    toggleLegend () {
        this.options.legend = this.getLegend();
    }

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

    setColors (colors) {
        this.options.colorAxis.colors = [this.options.colorAxis.colors[0]];

        for (var i = 0; i < colors.length; i++) {
            this.options.colorAxis.colors[i + 1] = colors[i];
        }
    }
}
