import TargetParser from '../src/TargetParser'

describe('TargetParser', function () {
  let targetParser = new TargetParser();
  let target = 'summarize(qvantel.product.data.CheapCallsAfter22, "1h", "sum", true)';

  describe('parseName(target)', function () {
    it('Should return the name from the target', function () {
      expect(targetParser.parseName(target)).to.equal('CheapCallsAfter22');
    })
  });

  describe('splitName(name)', function () {
    it('Should return a name with spaces from a camelcase name', function () {
      let name = targetParser.parseName(target);

      expect(targetParser.splitName(name)).to.equal('Cheap Calls After 22');
    });
  });

  describe('parseTimeType(target)', function () {
    it('Should return the timetype from target', function () {
      expect(targetParser.parseTimeType(target)).to.equal('h');
    });
  });
})
