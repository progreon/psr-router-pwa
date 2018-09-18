/**
 * Class representing a location.
 * @todo Everything
 */
class Location {
  /**
   *
   * @param {Game}        game
   * @param {string}      name
   * @param {Location[]}  subLocations
   */
  constructor(game, name, subLocations) {
    /** @type {Game} */
    this.game = game;
    /** @type {string} */
    this.name = name;
    /** @type {Location[]} */
    this.subLocations = subLocations;
  }

  /** @return {string} */
  toString() {
    return this.name;
  }
}

export { Location };
