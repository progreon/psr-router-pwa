/**
 * Class representing an evolution-key
 *
 * @class
 */
export default class EvolutionKey {
  /**
   *
   * @param {string}  type    One of [level, stone, trade-item]
   * @param {string}  value   The level, stone type, name of the item
   * @returns {EvolutionKey}
   */
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return this.type + "(" + this.value + ")";
  };

  static get Type() {
    return {
      LEVEL: "level",
      STONE: "stone",
      TRADE_ITEM: "trade-item"
    };
  }
}
