import IndexCalculator from './IndexCalculator';

/** Class for calculating trend */
export default class TrendCalculator {
  constructor () {
    this.timeTypeMap = this.initTimeTypeMap();
    this.indexCalculator = new IndexCalculator();
  }

  /** Inits a map for what timetype to be used in calculation */
  initTimeTypeMap () {
    var map = [];

    map['ms'] = 0;
    map['s'] = 1000;
    map['sec'] = 1000;
    map['m'] = 1000 * 60;
    map['min'] = 1000 * 60;
    map['h'] = 1000 * 60 * 60;

    return map;
  }

  /**
  * Returns k for a trendline based on datapoints.
  *
  * @param {Object} datapoints - datapoints for calculating trendline.
  * @param {String} timeType - time setting for graphite summarize. Example: 1h or 1m
  * @return {Integer} - the trend percentage
  */
  getTrend (datapoints, timeType) {
    var a = 0;
    var b = 0;
    var b1 = 0;
    var b2 = 0;
    var c = 0;
    var d = 0;
    var firstIndex = this.indexCalculator.getFirstPointIndex(datapoints);
    var lastIndex = this.indexCalculator.getLatestPointIndex(datapoints);

    if (firstIndex >= lastIndex || lastIndex <= 0) {
      return 0;
    }

    for (var i = firstIndex; i <= lastIndex; i++) {
      if (datapoints[i][0]) {
        b1 += datapoints[i][0];
      }
      b2 += i;
      a += datapoints[i][0] * i;
      c += Math.pow(i, 2);
    }

    a = a * (lastIndex - firstIndex + 1);
    b = b1 * b2;
    d = Math.pow(b2, 2);
    c = c * (lastIndex - firstIndex + 1);

    var slope = (a - b) / (c - d);
    var first = (b1 - (slope * b2)) / (lastIndex - firstIndex + 1);
    var last = first + slope * (lastIndex - firstIndex + 1);

    return this.getPercentageTrend(first, last);
  }

  /** Returns a simple trend based on first and last point in interval that is not null.
  *
  * @param {Object} datapoints - datapoints for calculating trendline.
  * @param {String} timeType - time setting for graphite summarize. Example: 1h or 1m
  */
  getSimpleTrend (datapoints, timeType) {
    var latestIndexNotNull = this.indexCalculator.getLatestPointIndex(datapoints);
    var firstIndexNotNull = this.indexCalculator.getFirstPointIndex(datapoints);
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
}
