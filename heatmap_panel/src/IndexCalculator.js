export default class IndexCalculator {
  getFirstPointIndex (datapoints) {
    var index = 0;
    while (datapoints[index + 1] && !datapoints[index][0]) {
      index++;
    }

    return index;
  }

  getLatestPointIndex (datapoints) {
    var index = datapoints.length - 1;
    while (datapoints[index - 1] && !datapoints[index][0]) {
      index--;
    }

    return index;
  }
}
