/** Class for calculating trend */
export default class TrendCalculator {
  constructor (ctrl) {
      this.ctrl = ctrl;
  }

  /**
  * Returns k for a trendline based on datapoints.
  *
  * @param {Object} datapoints - datapoints for calculating trendline.
  */
  getTrend (datapoints) {
    var a = 0;
    var b = 0;
    var b1 = 0;
    var b2 = 0;
    var c = 0;
    var d = 0;
    var firstIndex = this.getFirstDatapointWithData(datapoints);
    var lastIndex = this.getLastDatapointWithData(datapoints);
    if (firstIndex >= lastIndex || lastIndex <= 0) {
      return 0;
    }

    var timeOffset = datapoints[firstIndex][1];

    for (var i = firstIndex; i <= lastIndex; i++) {
      if (!datapoints[i][0]) {
        return 0;
      }
      b1 += datapoints[i][0];
      b2 += (datapoints[i][1] - timeOffset) / this.ctrl.timestampLength;
      a += datapoints[i][0] * ((datapoints[i][1] - timeOffset) / this.ctrl.timestampLength);
      c += Math.pow(((datapoints[i][1] - timeOffset) / this.ctrl.timestampLength), 2);
    }

    a = a * (lastIndex - firstIndex);
    b = b1 * b2;
    d = Math.pow(b2, 2);
    c = c * (lastIndex - firstIndex);

    var slope = Math.round((a - b) / (c - d));
    var first = (b1 - (slope * b2)) / (lastIndex - firstIndex);
    var last = first + slope * (lastIndex - firstIndex);

    return this.getPercentageTrend(first, last);
  }

  /** Returns a simple trend based on first and last point in interval that is not null.
  *
  * @param {Object} datapoints - datapoints for calculating trendline.
  */
  getSimpleTrend (datapoints) {
    var latestIndexNotNull = this.getFirstDatapointWithData(datapoints);
    var firstIndexNotNull = this.getLastDatapointWithData(datapoints);
    var y1 = datapoints[firstIndexNotNull][0];
    var y2 = datapoints[latestIndexNotNull][0];

    return this.getPercentageTrend(y1, y2);
  }

  /** Returns the change in percent based on the first and last point in trendline
  *
  * @param {Integer} first - The first value in datapoints
  * @param {Integer} last - The last value in datapoints
  */
  getPercentageTrend (first, last) {
    if (first > 0) {
      return Math.round(((last - first) / first) * 1000) / 10;
    } else {
      return Math.round(((last - first) / 1) * 1000) / 10;
    }
  }

  getFirstDatapointWithData (datapoints) {
      for (var i = 0; i < datapoints.length; i++) {
          if (datapoints[i][0] !== null) {
              return i;
          }
      }

      return 0;
  }

  getLastDatapointWithData (datapoints) {
      for (var i = datapoints.length - 1; i >= 0; i--) {
          if (datapoints[i][0] !== null) {
              return i;
          }
      }

      return datapoints.length - 1;
  }
}
