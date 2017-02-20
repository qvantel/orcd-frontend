export default class Map {
    constructor (ctrl, container, onReadyCallback) {
        this.ctrl = ctrl;
        this.container = container;
        this.onReadyCallback = onReadyCallback;
        this.options = {
            region: this.ctrl.getRegion(),
            colorAxis: {
                minValue: 0,
                maxValue: 100,
                colors: [this.ctrl.lightTheme ? '#f5f5f3' : '#151515', '#6699cc']
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
        this.data = [];
        this.ready = false;

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
        google.visualization.events.addListener(this.map, 'ready', function () {
            self.ready = true;
            self.onReadyCallback();
        });
        this.draw();
    }

    draw () {
        var data = [['Country', 'Popularity']];
        for (var key in this.data) {
            data.push([key, this.data[key].current]);
        }
        data = google.visualization.arrayToDataTable(data);

        this.map.draw(data, this.options);
    }

    setData (data) {
        for (var key in data) {
            var last = (this.data[key] ? this.data[key].wanted : 0);
            this.data[key] = {
                wanted: data[key],
                last: last,
                current: last
            };
        }
    }

    lerpDataValues (ratio) {
        for (var key in this.data) {
            this.data[key].current = this.lerp(this.data[key].last, this.data[key].wanted, ratio);
        }
    }

    lerp (x, y, t) {
        return x + t * (y - x);
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
}
