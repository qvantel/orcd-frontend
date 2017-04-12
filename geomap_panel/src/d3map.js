import * as d3 from './lib/d3.min';
import * as topojson from './lib/topojson.v2.min.js';

export default class D3map {
    constructor (ctrl, container, onReadyCallback) {
        this.ctrl = ctrl;
        this.container = container;
        this.readyCallback = onReadyCallback;
        this.colorScale = null;

        this.createMap();
    }

    createMap () {
        this.colorScale = d3.scaleLinear()
        .domain([0, 100])
        .range([this.ctrl.lightTheme ? '#f5f5f3' : '#151515', '#6699cc']);

        var self = this;
        var width = $('#map').width();
        var height = width / 1.5;

        var projection = d3.geoMercator()
        .scale(width / 395 * 60)
        .translate([width / 2, height / 1.5]);

        var path = d3.geoPath()
        .projection(projection);

        var svg = d3.select('#map').append('svg')
        .attr('preserveAspectRatio', 'xMidYMid')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('width', '100%')
        .attr('height', width * height / width);

        svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height);

        // Define the div for the tooltip
        let tooltip = d3.select('#map').append('g')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        var g = svg.append('g');
        d3.json('public/plugins/qvantel-geomap-panel/data/countries.json', function (world) {
            g.append('g')
            .attr('id', 'countries')
            .selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('id', function (d) { return d.id; })
            .attr('fill', function (d) {
                return self.getCountryPercentage(d.id);
            })
            .attr('d', path)
            .on('click', (d) => {
                countryClicked(d);
            })
            .on('mouseover', function (d) {
                tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);

                var minMaxCur = self.ctrl.data[d.id];
                var percent = 0;
                if (typeof minMaxCur !== 'undefined') {
                    percent = (minMaxCur.cur - minMaxCur.min) / (minMaxCur.max - minMaxCur.min) * 100;
                }

                tooltip.html(d.id + '<br/>' + percent + '%');
            })
            .on('mousemove', function (d) {
                tooltip.style('left', (d3.event.pageX - 80) + 'px')
                .style('top', (d3.event.pageY - 170) + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            })
        });

        var legendWidth = width * 0.4;
        var legendHeight = 10;
        var gradient = svg.append('defs')
          .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.colorScale(0))
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', this.colorScale(100))
            .attr('stop-opacity', 1);

        svg.append('rect')
            .attr('x', 20)
            .attr('y', height - 2 * legendHeight)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#gradient)');

        function getXyz (d) {
            let bounds = path.bounds(d);
            let wScale = (bounds[1][0] - bounds[0][0]) / width;
            let hScale = (bounds[1][1] - bounds[0][1]) / height;
            let z = 0.96 / Math.max(wScale, hScale);
            let x = (bounds[1][0] + bounds[0][0]) / 2;
            let y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
            if (z > 3) {
                z = 3
            }
            return [x, y, z];
        }

        function zoom (xyz) {
            g.transition()
            .duration(1500)
            .attr('transform', 'translate(' + projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ',-' + xyz[1] + ')')
            .selectAll(['#countries'])
            .attr('d', path.pointRadius(20.0 / xyz[2]));
        }

        function countryClicked (d) {
            if (typeof d !== 'undefined') {
                if (self.ctrl.inputHandler.isCtrlDown() || self.ctrl.inputHandler.isShiftDown()) {
                    self.ctrl.selectedCountriesHandler.onCountryClicked(d.id);
                    if (self.ctrl.selectedCountriesHandler.isCountrySelected(d.id) !== -1) {
                        //  Set random color on selected border
                        d3.selectAll('#' + d.id).classed('stroke-selected', true)
                        .style('stroke', self.colors[Math.floor(Math.random() * self.colors.length)]);
                    } else {
                        // remove color when unselect country
                        d3.selectAll('#' + d.id).classed('stroke-selected', false)
                        .attr('style', null);
                    }
                } else if (self.ctrl.panel.clickToZoomEnabled) {
                    if (d && self.country !== d) {
                        let xyz = getXyz(d);
                        self.country = d;
                        zoom(xyz);
                    } else {
                        let xyz = [width / 2, height / 1.5, 1];
                        self.country = null;
                        zoom(xyz);
                    }
                }
            }
        }
    }

    updateData () {
        var self = this;
        d3.select('svg').selectAll('.country')
        .attr('fill', function (d) {
            return self.getCountryPercentage(d.id);
        });
    }

    getCountryPercentage (countryCode) {
        var minMaxCur = this.ctrl.data[countryCode];

        if (typeof minMaxCur !== 'undefined') {
            var percent = (minMaxCur.cur - minMaxCur.min) / (minMaxCur.max - minMaxCur.min) * 100;
            return this.colorScale(percent);
        }

        return 0;
    }
}
