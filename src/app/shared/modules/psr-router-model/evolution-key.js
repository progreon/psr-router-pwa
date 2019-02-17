/**
 * Class representing an evolution-key.
 * TODO (see ExperienceGroup)
 */
class EvolutionKey {
  /**
   *
   * @param {string}  type    One of [level, stone, trade-item].
   * @param {string}  value   The level, stone type, name of the item (or empty if just trade).
   * @returns {EvolutionKey}
   */
  constructor(type, value) {
    /** @type {string} */
    this.type = type;
    /** @type {string} */
    this.value = value;
  }

  /** @returns {string} */
  toString() {
    return this.type + "(" + this.value + ")";
  }

  static get Type() {
    return {
      LEVEL: "level",
      STONE: "stone",
      TRADE_ITEM: "trade-item"
    };
  }
}

export { EvolutionKey };
