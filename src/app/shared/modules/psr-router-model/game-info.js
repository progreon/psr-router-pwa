/**
 * Class representing game information.
 */
class GameInfo {
  /**
   *
   * @param {string}   key          The key to use in maps
   * @param {string}   name         A more user friendly name
   * @param {number}   gen          The generation this game is made for
   * @param {number}   year         The year this game was released in
   * @param {string}   platform     The platform for which this game is made
   * @param {boolean}  unsupported  If this game isn't supported yet here
   */
  constructor(key, name, gen, year, platform, unsupported) {
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
    /** @type {boolean} */
    this.unsupported = unsupported;
  }
}

export { GameInfo };
