/**
 * Class representing an evolutionary stone.
 */
class Stone {
  /**
   *
   * @param {number}   id      The unique ID of this stone
   * @param {string}   key     The key to use in maps
   * @param {string}   name    A more user friendly name
   * @param {number}   gen     The generation it was introduced in
   */
  constructor(id, key, name, gen) {
    /** @type {number} */
    this.id = id;
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.name = name;
    /** @type {number} */
    this.gen = gen;
  }
}

export default Stone;
