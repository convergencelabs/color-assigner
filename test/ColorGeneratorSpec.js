const ColorGenerator = require('../build/lib/ColorGenerator');

describe('ColorGenerator', function() {
  describe('generateRandomColor(array)', function() {
    it('Should generate a non null color', function () {
      const color = ColorGenerator.generateRandomColor([]);
      color.should.not.be.null;
    });

    it('Should generate valid color', function () {
      const color = ColorGenerator.generateRandomColor([]);
      color.length.should.equal(4);
      color[0].should.be.within(0, 255);
      color[1].should.be.within(0, 255);
      color[2].should.be.within(0, 255);
      color[3].should.be.within(0, 255);
    });
  });
});
