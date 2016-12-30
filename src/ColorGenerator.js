export default class ColorGenerator {

  static generateRandomColor(currentColors) {
    // todo do something smarter.

    const r = Math.round(255 * Math.random());
    const g = Math.round(255 * Math.random());
    const b = Math.round(255 * Math.random());

    return [r, g, b, 255];
  }
}
