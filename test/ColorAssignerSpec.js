const ColorAssigner = require('../build/lib/ColorAssigner');

describe('ColorAssigner', function () {
  describe('constructor', function () {
    it('preferred colors should default to Palettes.DEFAULT', function () {
      const ca = new ColorAssigner();
      ca.palette().should.deepEqual(ColorAssigner.Palettes.DEFAULT);
    });
  });

  describe('getColorAsHex(id)', function () {
    it('should return the first preferred color', function () {
      const ca = new ColorAssigner(['#FF0000', '#0000FF']);
      const color = ca.getColorAsHex('r').toUpperCase();

      color.should.equal('#FF0000');
    });

    it('should return the same color for the same id', function () {
      const ca = new ColorAssigner(['#FF0000', '#0000FF']);
      const color1 = ca.getColorAsHex('r').toUpperCase();
      const color2 = ca.getColorAsHex('r').toUpperCase();

      color1.should.equal('#FF0000');
      color2.should.equal('#FF0000');
    });

    it('should return the a different color if released and gotten again', function () {
      const ca = new ColorAssigner(['#FF0000', '#0000FF']);
      const color1 = ca.getColorAsHex('r').toUpperCase();
      ca.releaseColor('r');
      const color2 = ca.getColorAsHex('r').toUpperCase();
      color1.should.not.equal(color2);
    });

    it('should put the released color on back of stack', function () {
      const ca = new ColorAssigner(['#FF0000', '#0000FF', '#00FF00']);
      const color1 = ca.getColorAsHex('r').toUpperCase();
      ca.releaseColor('r');
      const color2 = ca.getColorAsHex('b').toUpperCase();
      const color3 = ca.getColorAsHex('g').toUpperCase();
      const color4 = ca.getColorAsHex('r').toUpperCase();

      color1.should.equal('#FF0000');
      color2.should.equal('#0000FF');
      color3.should.equal('#00FF00');
      color4.should.equal('#FF0000');
    });

    it('should generate random well spaced color', function () {
      const ca = new ColorAssigner(['#ff0000', '#0000ff']);
      const color1 = ca.getColorAsHex('1');
      const color2 = ca.getColorAsHex('2');
      const color3 = ca.getColorAsHex('3');

      color1.should.equal('#ff0000');
      color2.should.equal('#0000ff');
      color3.should.not.equal('#ff0000');
      color3.should.not.equal('#0000ff');
    });
  });
});
