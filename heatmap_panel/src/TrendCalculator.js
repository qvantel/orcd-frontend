export default class TrendCalculator {
  getTrend (datapoints) {
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

  getSimpleTrend (datapoints) {
    var latestIndexNotNull = this.getLatestPointIndex(datapoints);

    var x1 = datapoints[0][1] / 1000;
    var x2 = datapoints[latestIndexNotNull][1] / 1000;
    var y1 = datapoints[0][0];
    var y2 = datapoints[latestIndexNotNull][0];

    return Math.round(((y2 - y1) / (x2 - x1)) * 100) / 100;
  }

  getLatestPointIndex (datapoints) {
    var index = datapoints.length - 1;
    while (!datapoints[index]) {
      index--;
    }

    return index;
  }
}
