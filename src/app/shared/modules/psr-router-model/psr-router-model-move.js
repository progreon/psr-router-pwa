/**
 * Class representing a Pokemon move
 *
 * @class
 */
export default class Move {
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
   * @returns {Move}
   */
  constructor(key, name, effect, power, type, accuracy, pp, category, description) {
    this.key = key;
    this.name = name;
    this.effect = effect;
    this.power = power;
    this.type = type;
    this.accuracy = accuracy;
    this.pp = pp;
    this.category = (category ? category : "other");
    this.description = description;
  }

  toString() {
    return name;
  };
}
