import TrendCalculator from '../src/TrendCalculator';

describe('TrendCalculator', function () {
  let trendCalculator = new TrendCalculator();
  let datapoints = [
    [2],
    [9],
    [1],
    [4],
    [6],
    [11],
    [1],
    [5],
    [8],
    [3]
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
      expect(trendCalculator.getTrend(datapoints)).to.equal(21.8);
    });
  });
});
