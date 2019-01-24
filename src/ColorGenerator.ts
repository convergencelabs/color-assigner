import {RgbaColor} from "./RgbaColor";

/**
 * A helper class used to generate random colors.
 */
export class ColorGenerator {
  /**
   * Generates a random color, taking as input currently known colors.
   *
   * @param currentColors
   *   The currently used colors.
   *
   * @returns
   *   A new random color.
   */
  static generateRandomColor(currentColors: RgbaColor[]): RgbaColor {
    const r = Math.round(255 * Math.random());
    const g = Math.round(255 * Math.random());
    const b = Math.round(255 * Math.random());

    return new RgbaColor(r, g, b, 255);
  }
}
