import IndexCalculator from './IndexCalculator';
export default class TrendCalculator {
  constructor () {
    this.timeTypeMap = this.initTimeTypeMap();
    this.indexCalculator = new IndexCalculator();
  }

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

  getTrend (datapoints, timeType) {
    var a = 0;
    var b = 0;
    var b1 = 0;
    var b2 = 0;
    var c = 0;
    var d = 0;

    for (var i = 0; i < datapoints.length; i++) {
      b1 += datapoints[i][0];
      b2 += datapoints[i][1];
      a += datapoints[i][0] * datapoints[i][1];
      c += Math.pow(datapoints[i][1], 2);
    }

    a = a * datapoints.length;
    b = b1 * b2;
    d = Math.pow(b2, 2);

    return Math.round(((a - b) / (c - d)) * 1000);
  }

  getSimpleTrend (datapoints, timeType) {
    var latestIndexNotNull = this.indexCalculator.getLatestPointIndex(datapoints);
    var firstIndexNotNull = this.indexCalculator.getFirstPointIndex(datapoints);
    var y1 = datapoints[firstIndexNotNull][0];
    var y2 = datapoints[latestIndexNotNull][0];

    return this.getPercentageTrend(y1, y2);
  }

  getPercentageTrend (first, last) {
    if (first > 0) {
      return Math.round(((last - first) / first) * 1000) / 10;
    } else {
      return Math.round(((last - first) / 1) * 1000) / 10;
    }
  }
}
