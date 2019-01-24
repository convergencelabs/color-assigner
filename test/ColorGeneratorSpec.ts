import 'mocha';
import {ColorGenerator} from "../src/ColorGenerator";
import 'should';

describe('ColorGenerator', function() {
  describe('generateRandomColor(array)', function() {
    it('Should generate a non null color', function () {
      const color = ColorGenerator.generateRandomColor([]);
      color.should.not.be.null;
    });

    it('Should generate valid color', function () {
      const color = ColorGenerator.generateRandomColor([]);
      color.r.should.be.within(0, 255);
      color.g.should.be.within(0, 255);
      color.b.should.be.within(0, 255);
      color.a.should.be.within(0, 255);
    });
  });
});
