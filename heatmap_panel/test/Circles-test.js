import Circles from '../src/Circles'

describe('Circles', function () {
  let ctrl = {
    'panel': {
      'colors': ['red', 'green', 'blue']
    },
    'currentMax': [20]
  }
  let data = {
    'datapoints': [
      [10],
      [20],
      [30],
      [50]
    ]
  }
  let circles = new Circles(ctrl);

  describe('When created', function () {
    it('Should be initiated correctly', function () {
      expect(circles.ctrl).to.eql(ctrl);
      expect(circles.circleWidth).to.eql(100);
      expect(circles.colors).to.eql(['red', 'green', 'blue']);
      expect(circles.currentColorIndex).to.equal(0);
    });
  });

  describe('getColor()', function () {
    it('Should return the color of at currentColorIndex and increase index by 1', function () {
      expect(circles.getColor()).to.equal('red');
      expect(circles.currentColorIndex).to.equal(1);
    });
  });

  describe('getScale(d, i)', function () {
    it('Should return a scale based on circleWidth and max', function () {
      let scale = circles.getScale(data, 0);
      expect(circles.ctrl.currentMax[0]).to.eql(50);
      expect(scale(10)).to.equal(20);
      expect(scale(0)).to.equal(0);
      expect(scale(50)).to.equal(100);
    });
  });
});
