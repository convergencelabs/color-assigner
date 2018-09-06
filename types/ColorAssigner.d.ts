import { HexColor } from '.';
import palettes, { palette } from './Palettes';

declare class ColorAssigner {
  static readonly Palettes: palettes;

  constructor(palette: palette);

  palette(): palette;

  getColor(id: string): HexColor;
  getColorAsRgba(id: string): string;
  getColorAsHex(id: string): string;

  claimColor(id: string, colorStr: string): void;

  releaseColor(id: string): void;
}

export default ColorAssigner;