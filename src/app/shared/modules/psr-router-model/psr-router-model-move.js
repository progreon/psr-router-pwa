/**
 * Class representing a Pokemon move.
 */
class Move {
  /**
   *
   * @param {string}  key      The key to use in maps
   * @param {string}  name     A more user friendly name
   * @param {string}  effect   The name of the effect this move has
   * @param {number}  power    The power of the move
   * @param {Type}    type     The type of this move
   * @param {number}  accuracy The accuracy of this move
   * @param {number}  pp       The initial PP of this move
   * @param {string}  category The move category in gen 4+
   */
  constructor(key, name, effect, power, type, accuracy, pp, category, description) {
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.effect = effect;
    /** @type {string} */
    this.power = power;
    /** @type {string} */
    this.type = type;
    /** @type {string} */
    this.accuracy = accuracy;
    /** @type {string} */
    this.pp = pp;
    /** @type {string} */
    this.category = (category ? category : "other");
    /** @type {string} */
    this.description = description;
  }

  /** @returns {string} */
  toString() {
    return this.name;
  }
}

export { Move };
