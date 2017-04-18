import * as d3 from './node_modules/d3/build/d3.min';

export default class Circles {
  constructor (ctrl) {
    this.ctrl = ctrl;
    this.circleWidth = 100; // Change this programatically
    this.max = ctrl.panel.max;
    this.min = ctrl.panel.min;
    this.colors = ctrl.panel.colors; // Fix colorbug.
    this.currentColorIndex = 0;
    this.offset = 0;
  }

  updateOffset (dataList) {
    if (dataList[0]) {
      var tmpOffset = 0;
      while (!dataList[0].datapoints[dataList[0].datapoints.length - 1 - tmpOffset][0] && tmpOffset < dataList[0].datapoints.length - 1) {
        tmpOffset++;
      }

      return tmpOffset;
    }
  }

  getOffset () {
    return this.offset;
  }

  getColor () {
    var color = this.colors[this.currentColorIndex];
    this.currentColorIndex++;

    return color;
  }

  getScale (d, i) {
    var max = d3.max(d.datapoints.map(function (datapoint) {
      return datapoint[0];
    }));

    this.ctrl.currentMax[i] = max;

    var scale = d3.scaleLinear()
      .range([0, this.circleWidth])
      .domain([0, d3.max(d.datapoints.map(function (datapoint) {
        return datapoint[0];
      }))]);

    return scale;
  }

  drawCircles (dataList, pointIndex) {
    this.offset = this.updateOffset(dataList);
    if (pointIndex === undefined) {
      this.drawCircles(dataList, dataList[0].datapoints.length - 1 - this.offset);
    } else {
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
        .attr('fill', 'white')
        .attr('cy', (this.circleWidth / 2) + 20)
        .attr('cx', (this.circleWidth / 2) + 20)
        .attr('r', function (d, i) {
          var scale = classContext.getScale(d, i);
          if (d.datapoints[pointIndex][0]) {
            return scale(d.datapoints[pointIndex][0]) / 2;
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
        .attr('stroke', 'grey');

      // Update size (and color) of already existing circles.
      // Have to update color and size in the same function since d3 can't handle concurrent transitions!
      this.updateCircleSize(dataList, '.circle', pointIndex);
      // Update service-value.
      // this.updateTextValue(dataList, '.current-service-value', '');
    }
  }

  updateCircleSize (dataList, circleClass, pointIndex) {
    this.offset = this.updateOffset(dataList);
    if (pointIndex === undefined) {
      this.updateCircleSize(dataList, circleClass, dataList[0].datapoints.length - 1 - this.offset);
    } else {
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
          if (d.datapoints[pointIndex][0]) {
            return scale(d.datapoints[pointIndex][0]) / 2;
          } else {
            return 0;
          }
        });
    }
  }

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
