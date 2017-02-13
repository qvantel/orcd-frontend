export default class Map {
    constructor (ctrl, container) {
        this.ctrl = ctrl;
        this.container = container;
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
            google.charts.load('visualization', '1', {'packages': ['geochart']});
            google.charts.setOnLoadCallback(function () {
                self.createMap();
            });
        }
    }

    createMap () {
        this.map = new google.visualization.GeoChart(this.container);
        google.visualization.events.addListener(this.map, 'ready', function () {
            self.ready = true;
        });
        this.draw();
    }

    draw () {
        this.ready = false;
        var data = new google.visualization.DataTable();

        data.addColumn('number', 'Lat');
        data.addColumn('number', 'Long');
        data.addColumn('number', 'Value');

        var minLat = 55.0;
        var maxLat = 69.0;
        var minLong = -15.0;
        var maxLong = 45.0;

        for (var i = 0; i < 1; i++) {
            var lat = (Math.random() * (maxLat - minLat) + minLat);
            var long = (Math.random() * (maxLong - minLong) + minLong);

            lat = Math.round(lat * 100) / 100;
            long = Math.round(long * 100) / 100;

            data.addRows([[lat, long, 0]]);
        }

        var options = {
          region: 'SE',
          // displayMode: 'markers',
          // colorAxis: {colors: ['green', 'blue']},
          backgroundColor: {
            'fill': '#3a3a3a'
          },
          datalessRegionColor: '#151515',
          legend: 'none',
          sizeAxis: {minValue: 1, maxValue: 1, minSize: 3, maxSize: 3},
          colorAxis: {minValue: 0, maxValue: 0, colors: ['#ff0000']}
        };

        this.map.draw(data, options);
    }
}
