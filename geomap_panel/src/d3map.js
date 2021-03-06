import * as d3 from './node_modules/d3/build/d3.min';
import * as topojson from './node_modules/topojson/dist/topojson.min';

export default class D3map {
    constructor (ctrl, onReadyCallback) {
        this.ctrl = ctrl;
        this.readyCallback = onReadyCallback;
        this.colorScale = null;
        this.debug = false;
        this.strokeColors = ['#7EB26D', '#EAB839', '#6ED0E0', '#EF843C', '#E24D42', '#1F78C1', '#BA43A9', '#705DA0', '#508642', '#CCA300', '#447EBC', '#C15C17', '#890F02', '#0A437C', '#6D1F62', '#584477', '#B7DBAB', '#F4D598',
        '#70DBED', '#F9BA8F', '#F29191', '#82B5D8', '#E5A8E2', '#AEA2E0', '#629E51', '#E5AC0E', '#64B0C8', '#E0752D', '#BF1B00', '#0A50A1', '#962D82', '#614D93', '#9AC48A', '#F2C96D', '#65C5DB', '#F9934E', '#EA6460', '#5195CE',
        '#D683CE', '#806EB7', '#3F6833', '#967302', '#2F575E', '#99440A', '#58140C', '#052B51', '#511749', '#3F2B5B', '#E0F9D7', '#FCEACA', '#CFFAFF', '#F9E2D2', '#FCE2DE', '#BADFF4', '#F9D9F9', '#DEDAF7'];
        this.currentColorIndex = 0;
        this.tooltip;
        this.tooltipCurrentID;
        this.tooltipCurrentNAME;
        this.createMap();
    }

    /**
    * Build the map with the help of d3js
    */
    createMap () {
        // Define a color scale for the color of each country
        this.colorScale = d3.scaleLinear()
        .domain([0, 100])
        .range([this.ctrl.lightTheme ? '#f5f5f3' : '#151515', '#6699cc']);

        // Specify the wanted dimensions
        var self = this;
        var width = $('#map').width();
        var height = width / 1.5;

        // Project the map using geoMercator, scale and translate the map to make a good fit
        var projection = d3.geoMercator()
        .scale(width / 395 * 60)
        .translate([width / 2, height / 1.5]);

        // Define the geo path
        var path = d3.geoPath()
        .projection(projection);

        // Append a svg object to the map element
        var svg = d3.select('#map').append('svg')
        .attr('preserveAspectRatio', 'xMidYMid')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('width', '100%')
        .attr('height', width * height / width);

        // Append the background to the svg
        svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', (d) => {
            countryClicked();
        });

        // Append the tooltip to the body of the document
        this.tooltip = d3.select('body').append('g')
        .attr('class', 'd3tooltip')
        .style('opacity', 0);

        // Iterate all countries generated in the countries.json file
        // For each country, draw the borders and bind mouse events
        var g = svg.append('g');
        d3.json('public/plugins/geomap-panel/data/countries.json', function (world) {
            g.append('g')
            .attr('id', 'countries')
            .selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('id', function (d) { return d.properties.ISO2; })
            .attr('d', path)
            .on('click', (d) => {
                countryClicked(d);
            })
            .on('mouseover', function (d) {
                self.tooltip.transition()
                .duration(200)
                .style('opacity', 1);
                self.tooltipCurrentID = d.properties.ISO2;
                self.tooltipCurrentNAME = d.properties.NAME
                self.updateTooltip();
            })
            .on('mousemove', function (d) {
                self.tooltip.style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px');
            })
            .on('mouseout', function (d) {
                self.tooltip.transition()
                .duration(200)
                .style('opacity', 0);
            })

            self.updateStrokeColor();
            self.updateCountryColor();
        });

        // Create the legend gradient
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

        /**
        * Get the center position of a country
        * @param {Object} d The country object
        * @return {Array} the coordinates for the center of the country
        */
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

        /**
        * Zoom into a point on the map defined by coordinates
        *
        * @param {array} xyz XYZ coordinates of where to zoom into
        */
        function zoom (xyz) {
            g.transition()
            .duration(1500)
            .attr('transform', 'translate(' + projection.translate() + ')scale(' + xyz[2] + ')translate(-' + xyz[0] + ',-' + xyz[1] + ')')
            .selectAll(['#countries'])
            .attr('d', path.pointRadius(20.0 / xyz[2]));
        }

        /**
        * When a country has been clicked, check if ctrl or shift is pressed
        * Then decide if to mark or zoom into that country
        *
        * @param {Object} d the country object clicked
        */
        function countryClicked (d) {
            if (!self.ctrl.dashboard.snapshot && typeof d !== 'undefined' && (self.ctrl.inputHandler.isCtrlDown() || self.ctrl.inputHandler.isShiftDown())) {
                if (typeof self.ctrl.data[d.properties.ISO2.toLowerCase()] !== 'undefined') {
                  self.ctrl.selectedCountriesHandler.onCountryClicked(d.properties.ISO2);
                }
            } else if (self.ctrl.panel.clickToZoomEnabled) {
                if (typeof d !== 'undefined' && self.country !== d) {
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

    /**
    * Selecting all countries, the countries that is NOT selected will be pushed above the ones that ARE
    * This is because we want the selected borders to be above the ones that are not selected
    * Because otherwise, the selected ones might get cut-off
    */
    sortCountries () {
        d3.selectAll('.country').each(function () {
            let firstChild = this.parentNode.firstChild;
            if (!this.className.baseVal.includes('stroke-selected')) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    }

    /**
    * Iterate all countries and set a stroke on the selected ones and disable the stroke on the others
    */
    updateStrokeColor () {
        var countries = this.ctrl.selectedCountriesHandler.selectedCountries;

        // Disable the stroke for all countries
        d3.selectAll('.country')
        .classed('stroke-selected', false)
        .attr('style', null);

        // Iterate all selected countries and stroke them
        var colorIndex = 0;
        for (var i = 0; i < countries.length; i++) {
            d3.select('#' + countries[i].toUpperCase())
            .classed('stroke-selected', true)
            .style('stroke', this.strokeColors[colorIndex]);

            colorIndex++;
            if (colorIndex > this.strokeColors.length) {
                colorIndex = 0;
            }
        }
        this.sortCountries();
    }

    /**
    * Update the color for each country
    */
    updateCountryColor () {
        var commonMinMax;

        // If the option individualMaxValue is not true, find a common max value
        if (!this.ctrl.panel.individualMaxValue) {
            commonMinMax = this.findCommonMinMaxValue();
        }

        // Set the color for each country depending on their percent (cur / max)
        var self = this;
        d3.select('svg').selectAll('.country')
        .attr('fill', function (d) {
            return self.colorScale(Math.floor(self.getCountryPercentage(d.properties.ISO2, commonMinMax)));
        });
    }

    /**
    * Find the common min and max value for all countries
    * The max value is found by comparing all countries current value
    */
    findCommonMinMaxValue () {
        var max = Number.MIN_VALUE;
        var min = Number.MAX_VALUE;

        for (var key in this.ctrl.data) {
            var d = this.ctrl.data[key];
            var current = d.cur;

            // If the the timelapse is active, select from the timelapse instead
            if (this.ctrl.timelapseHandler.isAnimating) {
                current = d.all[this.ctrl.timelapseHandler.getCurrent()];
            }

            max = Math.max(max, current);
            min = Math.min(min, current);
        }

        return {min: min, max: max};
    }

    /**
    * Call this function when new data is available in order to request and update for the map
    */
    updateData () {
        this.updateCountryColor();
        this.updateTooltip();
    }

    /**
    * Update the tooltip values
    */
    updateTooltip () {
        // Make sure that the tooltip has been initialized and that it has a valid country connected to it
        if (typeof this.tooltip !== 'undefined' && typeof this.tooltipCurrentID !== 'undefined') {
            var data = this.ctrl.data[this.tooltipCurrentID.toLowerCase()];
            var html;

            // Make sure that the country has data
            if (typeof data !== 'undefined') {
                var curr = data.cur;
                var commonMinMax;

                // If a timelapse is in progress, get the value from that instead
                if (this.ctrl.timelapseHandler.isAnimating) {
                    curr = data.all[this.ctrl.timelapseHandler.getCurrent()];
                }

                // If the option individualMaxValue is false, find a common min and max value
                if (!this.ctrl.panel.individualMaxValue) {
                    commonMinMax = this.findCommonMinMaxValue();
                }

                html = '<div class = \'d3tooltip-title\'>' + this.tooltipCurrentNAME + '</div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Percent: </div><div class = \'d3tooltip-right\'>' + Math.floor(this.getCountryPercentage(this.tooltipCurrentID, commonMinMax)) + '%</div><div class = \'d3tooltip-clear\'></div></div>';
                html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Current: </div><div class = \'d3tooltip-right\'>' + curr + '</div><div class = \'d3tooltip-clear\'></div></div>';

                if (this.ctrl.panel.individualMaxValue) {
                    html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Min: </div><div class = \'d3tooltip-right\'>' + data.min + '</div><div class = \'d3tooltip-clear\'></div></div>';
                    html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Max: </div><div class = \'d3tooltip-right\'>' + data.max + '</div><div class = \'d3tooltip-clear\'></div></div>';
                    html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Trend: </div><div class = \'d3tooltip-right\'>' + data.trend + '%</div><div class = \'d3tooltip-clear\'></div></div>';
                } else {
                    html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Common min: </div><div class = \'d3tooltip-right\'>' + commonMinMax.min + '</div><div class = \'d3tooltip-clear\'></div></div>';
                    html += '<div class = \'d3tooltip-info\'><div class = \'d3tooltip-left\'>Common max: </div><div class = \'d3tooltip-right\'>' + commonMinMax.max + '</div><div class = \'d3tooltip-clear\'></div></div>';
                }

            } else {
                html = '<div class = \'d3tooltip-title\'>' + this.tooltipCurrentNAME + '</div>';
                html += '<div class = \'d3tooltip-undefined\'>No available data</div>';
            }

            this.tooltip.html(html);
        }
    }

    /**
    * Calculate and return the percentage from a country
    * If a commonMinMax is present, use that max value for the equation
    *
    * @param {string} countryCode The country code of the countrys percentage to be calculated
    * @param {object} commonMinMax The common min and max value, if present
    * @return {number} The percentage
    */
    getCountryPercentage (countryCode, commonMinMax) {
        var minMaxCur = this.ctrl.data[countryCode.toLowerCase()];

        // Make sure taht the country has data
        if (typeof minMaxCur !== 'undefined') {
            var percent = 0;
            var max = minMaxCur.max;
            var curr = minMaxCur.cur;

            // If a common max is present, use this instead of the countrys max value
            if (typeof commonMinMax !== 'undefined' && commonMinMax.max >= 0) {
                max = commonMinMax.max;
            }

            // If a timelapse is in progress, use that value instead
            if (this.ctrl.timelapseHandler.isAnimating) {
                curr = minMaxCur.all[this.ctrl.timelapseHandler.getCurrent()];
            }

            if (max !== 0) {
                percent = curr / max * 100;
            }

            return percent;
        }

        return 0;
    }
}
