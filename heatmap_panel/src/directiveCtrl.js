import angular from 'angular';
import * as vis from './scripts/vis';
import * as d3 from './scripts/d3.v3.min';

'use strict'

angular.module('grafana.controllers').controller('heatMapCtrl', function($log, $scope){
    var vm = this;
    vm.message = "My D3 Directive";
    vm.dataSet = [];

    //VISJS EXAMPLE
    var DELAY = 1000; // delay in ms to add new data points

    var strategy = document.getElementById('strategy');

    // create a graph2d with an (currently empty) dataset
    var container = document.getElementById('tl');
    var dataset = new vis.DataSet();

    var options = {
        start: vis.moment().add(-30, 'seconds'), // changed so its faster
        end: vis.moment(),
        dataAxis: {
            left: {
                range: {
                    min:0, max: 1000
                }
            }
        },
        drawPoints: {
            style: 'circle' // square, circle
        },
        shaded: {
            orientation: 'bottom' // top, bottom
        }
    };
    var graph2d = new vis.Graph2d(container, dataset, options);

    /**
     * Add a new datapoint to the graph
     */
    function addDataPoint(item) {
        // add a new data point to the dataset
        var now = vis.moment();
        dataset.add({
            x: now,
            y: item[0]
        });

        // remove all data points which are no longer visible
        var range = graph2d.getWindow();
        var interval = range.end - range.start;
        var oldIds = dataset.getIds({
            filter: function (item) {
                return item.x < range.start - interval;
            }
        });
        dataset.remove(oldIds);
    }

    /*
    (function(d3) {
        'use strict';

        var dataset = [
            { label: 'Abulia', count: 10 },
            { label: 'Betelgeuse', count: 20 },
            { label: 'Cantaloupe', count: 30 },
            { label: 'Dijkstra', count: 40 }
        ];

        var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;

        var color = d3.scale.category20b();

        var svg = d3.select('#chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
            .outerRadius(radius);

        var pie = d3.layout.pie()
            .value(function(d) { return d.count; })
            .sort(null);

        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.label);
            });
    })(window.d3);
    */

    // watching for new incoming data
    $scope.$watch('vm.data', function(newValue, oldValue) {
        if(angular.isDefined(vm.data)){
            vm.data.forEach(function(dataItem) {
                vm.dataSet.push(dataItem);
                if(dataItem[2] == 'Spotify'){
                    addDataPoint(dataItem);
                }
            });
        }
    });
});