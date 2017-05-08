import TrendCalculator from '../src/trendCalculator';

describe('TrendCalculator', function () {
  let ctrl = {
      timestampLength: 1000
  };
  let trendCalculator = new TrendCalculator(ctrl);
  let datapoints = [
    [2, 1000],
    [9, 2000],
    [1, 3000],
    [4, 4000],
    [6, 5000],
    [11, 6000],
    [1, 7000],
    [5, 8000],
    [8, 9000],
    [3, 10000]
  ]

  describe('getPercentageTrend(first, last)', function () {
    it('Should return a trend percentage based on two values', function () {
      expect(trendCalculator.getPercentageTrend(1, 11)).to.equal(1000);
      expect(trendCalculator.getPercentageTrend(-1, -11)).to.equal(-1000);
      expect(trendCalculator.getPercentageTrend(1, -9)).to.equal(-1000);
      expect(trendCalculator.getPercentageTrend(0, 10)).to.equal(1000);
    });
  });

  describe('getSimpleTrend(datapoints)', function () {
    it('Should return a trend in percentage based on last and first point', function () {
      expect(trendCalculator.getSimpleTrend(datapoints)).to.equal(50);
    });
  });

  describe('getTrend(datapoints)', function () {
    it('Should return a trend in percentage based on the simple linear regression', function () {
      expect(trendCalculator.getTrend(datapoints)).to.equal(0);
    });
  });
});
