/**
 * A Color, represented in an 8-bit RGBA.
 */
export class RgbaColor {
  /**
   *
   * @param r
   *   The red value for the color (0-255)
   * @param g
   *   The green value for the color (0-255)
   * @param b
   *   The blue value for the color (0-255)
   * @param a
   *  The alpha value for the color (0-255)
   */
  constructor(public r: number,
              public g: number,
              public b: number,
              public a: number) {
    this._validateNumber(r, "r");
    this._validateNumber(g, "g");
    this._validateNumber(b, "b");
    this._validateNumber(a, "a");
    Object.freeze(this);
  }

  /**
   * Determines if this color is the same as another color.
   *
   * @param other
   *   The other color to compare against.
   *
   * @returns
   *   True if the colors are the same, false otherwise.
   */
  public equals(other: RgbaColor): boolean {
    return this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a;
  }

  /** @internal **/
  private _validateNumber(val: number, name: string): void {
    if (val < 0 || val > 255) {
      throw new Error(`Invalid 8-bit number for ${name}. RGBA values must be between 0 and 255, inclusive`);
    }
  }
}
