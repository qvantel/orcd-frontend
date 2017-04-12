import * as d3 from './lib/d3.min';
import * as topojson from './lib/topojson.v2.min.js';

export default class D3map {

    constructor (ctrl, container, onReadyCallback) {
        this.ctrl = ctrl;
        this.container = container;
        this.readyCallback = onReadyCallback;
        this.createMap();
        this.svg;
        this.g;
        this.path;
        this.width;
        this.height;
        this.country = null;
        this.color;
        this.colors;
    }

    createMap () {
        let self = this;
        this.width = $('#map').width();
        this.height = $('#map').width() / 1.5;
        this.projection = d3.geoMercator()
        .scale(this.width / 395 * 60)
        .translate([this.width / 2, this.height / 1.5]);

        var colorScale = d3.scaleLinear()
        .domain([0, 100])
        .range([this.ctrl.lightTheme ? '#f5f5f3' : '#151515', '#6699cc']);

        this.path = d3.geoPath()
        .projection(this.projection);

        this.svg = d3.select('#map').append('svg')
        .attr('preserveAspectRatio', 'xMidYMid')
        .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
        .attr('width', '100%')
        .attr('height', this.width * this.height / this.width);

        this.svg.append('rect')
        .attr('class', 'background')
        .attr('width', this.width)
        .attr('height', this.height);

        // Define the div for the tooltip
        let tooltip = d3.select('#map').append('g')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        this.g = this.svg.append('g');
        d3.json('public/plugins/qvantel-geomap-panel/data/countries.json', function (world) {
            self.g.append('g')
            .attr('id', 'countries')
            .selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('id', function (d) { return d.id; })
            .attr('fill', function (d) {
                var minMaxCur = self.ctrl.data[d.id.toLowerCase()];

                if (typeof minMaxCur !== 'undefined') {
                    var percent = (minMaxCur.cur - minMaxCur.min) / (minMaxCur.max - minMaxCur.min) * 100;
                    return colorScale(percent);
                }

                return 0;
            })
            .attr('d', self.path)
            .on('click', (d) => {
                self.countryClicked(d);
            })
            .on('mouseover', function (d) {
                tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);

                var minMaxCur = self.ctrl.data[d.id.toLowerCase()];
                var percent = 0;
                if (typeof minMaxCur !== 'undefined') {
                    percent = (minMaxCur.cur - minMaxCur.min) / (minMaxCur.max - minMaxCur.min) * 100;
                }

                tooltip.html(d.id + '<br/>' + percent + '%');
            })
            .on('mousemove', function (d) {
                self.ctrl.log(d3.event)
                tooltip.style('left', (d3.event.pageX - 80) + 'px')
                .style('top', (d3.event.pageY - 170) + 'px');
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            })
        });

        let legendWidth = this.width * 0.4;
        let legendHeight = 10;

        let gradient = this.svg.append('defs')
          .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', colorScale(0))
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', colorScale(100))
            .attr('stop-opacity', 1);

        this.svg.append('rect')
            .attr('x', 20)
            .attr('y', self.height - 2 * legendHeight)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#gradient)');
    }

    getXyz (d) {
        let bounds = this.path.bounds(d);
        let wScale = (bounds[1][0] - bounds[0][0]) / this.width;
        let hScale = (bounds[1][1] - bounds[0][1]) / this.height;
        let z = 0.96 / Math.max(wScale, hScale);
        let x = (bounds[1][0] + bounds[0][0]) / 2;
        let y = (bounds[1][1] + bounds[0][1]) / 2 + (this.height / z / 6);
        if (z > 3) {
            z = 3
        }
        return [x, y, z];
    }

    zoom (xyz) {
        this.g.transition()
        .duration(1500)
        .attr('transform', 'translate(' + this.projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ',-' + xyz[1] + ')')
        .selectAll(['#countries'])
        .attr('d', this.path.pointRadius(20.0 / xyz[2]));
    }

    countryClicked (d) {
        if (typeof d !== 'undefined') {
            if (this.ctrl.inputHandler.isCtrlDown() || this.ctrl.inputHandler.isShiftDown()) {
                this.ctrl.selectedCountriesHandler.onCountryClicked(d.id);
                if (this.ctrl.selectedCountriesHandler.isCountrySelected(d.id) !== -1) {
                    //  Set random color on selected border
                    d3.selectAll('#' + d.id).classed('stroke-selected', true)
                    .style('stroke', this.colors[Math.floor(Math.random() * this.colors.length)]);
                } else {
                    // remove color when unselect country
                    d3.selectAll('#' + d.id).classed('stroke-selected', false)
                    .attr('style', null);
                }
            } else if (this.ctrl.panel.clickToZoomEnabled) {
                if (d && this.country !== d) {
                    let xyz = this.getXyz(d);
                    this.country = d;
                    this.zoom(xyz);
                } else {
                    let xyz = [this.width / 2, this.height / 1.5, 1];
                    this.country = null;
                    this.zoom(xyz);
                }
            }
        }
    }

    updateData () {
        let self = this;
        this.svg.selectAll('.country')
        .attr('value', function (d) { return self.ctrl.data[d.id.toLowerCase()]; })
        .attr('fill', function (d) { return self.color(self.ctrl.data[d.id.toLowerCase()]) });
    }

    /**
    * Toggle the legend
    */
    toggleLegend () {
        this.options.legend = this.getLegend();
    }
}
