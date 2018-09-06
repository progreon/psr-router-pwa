/**
 * Class representing game information
 *
 * @class
 */
export default class GameInfo {
  /**
   *
   * @param {string}   key      The key to use in maps
   * @param {string}   name     A more user friendly name
   * @param {number}   gen      The generation this game is made for
   * @param {number}   year     The year this game was released in
   * @param {string}   platform The platform for which this game is made
   * @returns {GameInfo}
   */
  constructor(key, name, gen, year, platform) {
    this.key = key;
    this.name = name;
    this.gen = gen;
    this.year = year;
    this.platform = platform;
  }
}
