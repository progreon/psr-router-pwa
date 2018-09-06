/**
 * Class representing an evolutionary stone
 *
 * @class
 */
export default class Stone {
  /**
   *
   * @param {number}   id      The unique ID of this stone
   * @param {string}   key     The key to use in maps
   * @param {string}   name    A more user friendly name
   * @param {number}   gen     The generation it was introduced in
   * @returns {Stone}
   */
  constructor(id, key, name, gen) {
    this.id = id;
    this.key = key;
    this.name = name;
    this.gen = gen;
  }
}
