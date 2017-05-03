import * as d3 from './node_modules/d3/build/d3.min';
import IndexCalculator from './IndexCalculator';

/** Class responsible for drawing circles to the screen */
export default class Circles {
  constructor (ctrl) {
    this.ctrl = ctrl;
    this.circleWidth = 100; // This should be set to this.ctrl.panel if changes are implemented.
    this.max = ctrl.panel.max;
    this.min = ctrl.panel.min;
    this.colors = ctrl.panel.colors;
    this.currentColorIndex = 0;
    this.indexCalculator = new IndexCalculator();
  }

  /**
  * Gets color from array in panelDefaults.
  */
  getColor () {
    var color = this.colors[this.currentColorIndex];
    this.currentColorIndex++;

    return color;
  }

  /**
  * Returns a scale for each individual datapoint.
  *
  * @param {Object} d - contains target and datapoints.
  * @param {Integer} i - index of d.
  * @return {d3.scale} a d3 scale that maps values to other values depending on d and i.
  */
  getScale (d, i) {
    var max = d3.max(d.datapoints.map(function (datapoint) {
      return datapoint[0];
    }));

    this.ctrl.currentMax[i] = max;

    var scale = d3.scaleLinear()
      .range([0, this.circleWidth])
      .domain([0, this.ctrl.currentMax[i]]);

    return scale;
  }

  /**
  * Draws the circles to the div with the id d2-circle-container.
  *
  * @param {Object} dataList - the list of queried tables from data source.
  * @param {Integer} pointIndex - Optional. Sets which data in dataList to draw.
  */
  drawCircles (dataList, pointIndex) {
    // Set controller this so that it's usable inside d3 function.
    var classContext = this;

    // Select dots div and bind datapoints.
    var circles = d3.selectAll('#d3-circle-container')
      .selectAll('svg')
      .data(dataList);

    // Remove values that are not used.
    circles.exit().remove();

    // Add one svg for each circle for new values.
    circles.enter()
      .append('svg')
      .classed('circle-svg', true)
      .attr('width', this.circleWidth + 40)
      .attr('height', this.circleWidth + 60)
      .append('circle') // Append colored circles.
      .classed('circle', true)
      .attr('fill', this.ctrl.lightTheme ? 'lightgrey' : 'white')
      .attr('cy', (this.circleWidth / 2) + 20)
      .attr('cx', (this.circleWidth / 2) + 20)
      .attr('r', function (d, i) {
        var scale = classContext.getScale(d, i);
        var index = 0;
        if (pointIndex) {
          index = pointIndex;
        } else {
          index = d.datapoints.length - 1;
        }

        if (d.datapoints[index][0]) {
          return scale(d.datapoints[index][0]) / 2;
        } else {
          return 0;
        }
      })
      .select(function () { // Select parent
          return this.parentNode;
      })
      .append('circle') // Append white circle.
      .classed('outer-circle', true)
      .attr('cy', (this.circleWidth / 2) + 20)
      .attr('cx', (this.circleWidth / 2) + 20)
      .attr('r', this.circleWidth / 2)
      .attr('fill-opacity', 0)
      .attr('stroke-width', 2)
      .attr('stroke', this.ctrl.lightTheme ? 'grey' : 'grey');

    // Update size (and color) of already existing circles.
    this.updateCircleSize(dataList, '.circle', pointIndex);
  }

  /**
  * Updates existing circles with new values.
  *
  * @param {Object} dataList - the list of queried tables from data source.
  * @param {String} circleClass - The class of the circle dom.
  * @param {Integer} pointIndex - The index of the data in dataList to be updated.
  */
  updateCircleSize (dataList, circleClass, pointIndex) {
    var classContext = this;

    // Update circle size.
    d3.selectAll('.circle-svg')
      .data(dataList)
      .select(circleClass)
      .transition()
      .duration(1000)
      .attr('cy', (this.circleWidth / 2) + 20)
      .attr('cx', (this.circleWidth / 2) + 20)
      .attr('r', function (d, i) {
        var scale = classContext.getScale(d, i);
        var index = 0;
        if (pointIndex) {
          index = pointIndex;
        } else {
          index = d.datapoints.length - 1;
        }

        if (d.datapoints[index][0]) {
          return scale(d.datapoints[index][0]) / 2;
        } else {
          return 0;
        }
      });
  }

  /**
  * Sets the color of a circle.
  *
  * @param {Object} dataList - the list of queried tables from data source.
  * @param {Integer} index - the index of the circle to change.
  * @param {String} circleClass - The class of the circle dom.
  * @param {String} color - Optional. The color to change to.
  */
  setCircleColor (dataList, index, circleClass, color) {
    var classContext = this;

    d3.selectAll('.circle-svg')
      .data(dataList)
      .filter(function (d, i) {
        return i === index;
      })
      .select(circleClass)
      .attr('fill', function (d) {
          if (color) {
            classContext.currentColorIndex--;
            return color;
          } else {
            return classContext.getColor();
          }
      });
  }
}
