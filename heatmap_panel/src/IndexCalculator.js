'use strict'

/** Class for finding certain indexes */
export default class IndexCalculator {
  /**
  * Returns the index of the first datapoint that is not null.
  *
  * @param {Object} datapoints - datapoints that might contain null.
  * @return {Integer} - the index of the first point that is not null.
  */
  getFirstPointIndex (datapoints) {
    var index = 0;
    while (datapoints[index + 1] && !datapoints[index][0]) {
      index++;
    }

    return index;
  }

  /**
  * Returns the index of the last datapoint that is not null.
  * @param {Object} datapoints - datapoints that might contain null.
  * @param {Integer} - the index of the last point that is not null.
  */
  getLatestPointIndex (datapoints) {
    var index = datapoints.length - 1;
    while (datapoints[index - 1] && !datapoints[index][0]) {
      index--;
    }

    return index;
  }
}
