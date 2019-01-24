import {ColorGenerator} from "./ColorGenerator";
import {default as palettes} from "./Palettes";
import {RgbaColor} from "./RgbaColor";
import * as parser from "csscolorparser";

/**
 * The ColorAssigner manages the assignment of colors to unique resources.  A
 * color will uniquely mapped to each resource.  Resources are identified by
 * a unique string id.  The consumer can provide an array of preferred colors
 * that will be used, if they are available. After all preferred colors are
 * assigned, random colors will be assigned.
 */
export class ColorAssigner {

  static get Palettes() {
    return palettes;
  }

  /** @internal **/
  private readonly _palette: string[];
  /** @internal **/
  private readonly _preferredColors: RgbaColor[];
  /** @internal **/
  private readonly _availableColors: RgbaColor[];
  /** @internal **/
  private readonly _assignedColorsById: {[key: string]: RgbaColor};
  /** @internal **/
  private readonly _assignedColors: RgbaColor[];

  /**
   * Creates a new ColorAssigner using the supplied preferred colors.
   *
   * @param palette
   *   An array of preferred colors to use.  These colors
   *   will be used as long as they are available.
   *
   * @constructor
   */
  constructor(palette?: string[]) {
    if (palette === undefined) {
      this._palette = ColorAssigner.Palettes.DEFAULT.slice(0);
    } else {
      this._palette = palette.slice(0);
    }
    Object.freeze(this._palette);

    this._preferredColors = this._palette.map((color) => {
      const c: number[] = parser.parseCSSColor(color);
      return ColorAssigner._toHexColor(c);
    });
    Object.freeze(this._preferredColors);

    this._availableColors = this._preferredColors.slice(0);
    this._assignedColorsById = {};
    this._assignedColors = [];
  }

  /**
   * Gets the current palette in use.
   *
   * @returns
   *   The palette of preferred colors.
   */
  public palette(): string[] {
    return this._palette.slice(0);
  }

  /**
   * Gets a color for a specified unique id.  If a color has previously been
   * assigned to this id, it will be returned.  Otherwise a new color will
   * be assigned.  A preferred color will be assigned if one is available,
   * otherwise a random color will be assigned and returned.
   *
   * Colors take the form of:
   *
   * {
   *   r: [0-255],
   *   g: [0-255],
   *   b: [0-255],
   *   a: [0-255]
   * }
   *
   * @param id
   *   The unique id to get a color for.
   * @returns
   *   A hex representation of the color.
   */
  public getColor(id: string | number): RgbaColor {
    if (typeof id !== "string" && typeof id !== "number") {
      throw new Error(`id must be a string or a number: ${id}`);
    }

    let color = this._assignedColorsById[id];

    if (color === undefined) {
      color = this._acquireColor();
      this._assignedColorsById[id] = color;
      this._assignedColors.push(color);
    }

    return color;
  }

  /**
   * Gets a color for the specified resource as an rgba string.
   * "rgba(200, 120, 56, 255)"
   *
   * @param id
   *   The id of the resource to get the color for.
   * @returns
   *   The color as an rgba string.
   */
  public getColorAsRgba(id: string | number): string {
    const color = this.getColor(id);

    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }

  /**
   * Gets a color for the specified resource as a hex string.
   * "#ff23b5"
   *
   * @param id
   *   The id of the resource to get the color for.
   * @returns
   *   The color as a hex string.
   */
  public getColorAsHex(id: string | number): string {
    const color = this.getColor(id);

    function pad(str) {
      while (str.length < 2) {
        str = "0" + str;
      }
      return str;
    }

    return "#" +
      pad(color.r.toString(16)) +
      pad(color.g.toString(16)) +
      pad(color.b.toString(16));
  }

  /**
   * Releases a color currently assigned to the unique id.  If the color being
   * released is a preferred color, it will be returned to the set of available
   * colors.
   *
   * @param id
   *   The id of the color to release.
   */
  releaseColor(id: string | number): void {
    if (typeof id !== "string" && typeof id !== "number") {
      throw new Error(`id must be a string or a number: ${id}`);
    }

    const color = this._assignedColorsById[id];

    if (color === undefined) {
      throw new Error(`No color assigned for id: ${id}`);
    }

    const index = this._assignedColors.findIndex(c => c.equals(color));

    this._assignedColors.splice(index, 1);
    delete this._assignedColorsById[id];

    // If this was a preferred color put it back on the list.
    if (this._preferredColors.findIndex(c => c.equals(color)) >= 0) {
      this._availableColors.push(color);
    }
  }

  /**
   * Determines if a color is available to claim.
   *
   * @param color
   *   The color in a valid css represenation.
   *
   * @returns
   *   True if the color is available to be claimed, false otherwise.
   */
  public isAvailable(color: string): boolean {
    const parsed = parser.parseCSSColor(color);
    const hexColor = ColorAssigner._toHexColor(parsed);
    return this._assignedColors.some(c => hexColor.equals(c));
  }

  /**
   * Claims a color for a particular id.
   *
   * @param id
   *   The id to claim the color for.
   * @param color
   *   The color to claim, in a valid CSS format.
   */
  public claimColor(id: string | number, color: string): void {
    const parsed = parser.parseCSSColor(color);
    if (parsed === null) {
      throw new Error(`Invalid color: ${color}`);
    }

    const hexColor = ColorAssigner._toHexColor(parsed);

    if (this._assignedColors.some(c => hexColor.equals(c))) {
      throw new Error(`Color already in use: ${color}`);

    }

    const foundIndex = this._availableColors.findIndex(c => hexColor.equals(c));
    if (foundIndex >= 0) {
      this._availableColors.splice(foundIndex, 1);
    }

    this._assignedColorsById[id] = hexColor;
    this._assignedColors.push(hexColor);
  }

  /**
   * Acquires an unused color. This method will attempt to return a preferred
   * color first, and then generate a random color if a preferred color is not
   * available.
   *
   * @returns
   *   A hex representation of the color.
   * @internal
   */
  private _acquireColor(): RgbaColor {
    let color = null;

    if (this._availableColors.length > 0) {
      color = this._availableColors[0];
      this._availableColors.splice(0, 1);
    } else {
      color = ColorGenerator.generateRandomColor(this._assignedColors);
    }

    return color;
  }

  /** @internal **/
  private static _toHexColor(c: number[]): RgbaColor {
    return new RgbaColor(c[0], c[1], c[2], c[3]);
  }
}
