/**
 * Class representing game information.
 */
class GameInfo {
  /**
   *
   * @param {string}   key      The key to use in maps
   * @param {string}   name     A more user friendly name
   * @param {number}   gen      The generation this game is made for
   * @param {number}   year     The year this game was released in
   * @param {string}   platform The platform for which this game is made
   */
  constructor(key, name, gen, year, platform) {
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.name = name;
    /** @type {number} */
    this.gen = gen;
    /** @type {number} */
    this.year = year;
    /** @type {string} */
    this.platform = platform;
  }
}

export { GameInfo };
