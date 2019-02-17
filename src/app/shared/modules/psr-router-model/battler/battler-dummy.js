/**
 * Class representing a dummy battler
 */
class BattlerDummy {
  /**
   *
   * @param {Game}          game          The game
   * @param {Pokemon}       pokemon       The pokemon
   * @param {EncounterArea} catchLocation The catch location of this battler (used for calculating possible DVs)
   * @param {boolean}       isTrainerMon  If it's a trainer's pokemon (TODO: do this more properly?)
   * @param {number}        level         The current level
   */
  constructor(game, pokemon, catchLocation, isTrainerMon, level) {
    /**
     * @type {Game}
     * @protected
     */
    this._game = game; // TODO: include this?
    /**
     * @type {Pokemon}
     * @protected
     */
    this._pokemon = pokemon; // TODO: Pokemon or string?
    /**
     * @type {EncounterArea}
     * @protected
     */
    this._catchLocation = catchLocation;
    /**
     * @type {number}
     * @protected
     */
    this._isTrainerMon = isTrainerMon;
    /**
     * @type {number}
     * @protected
     */
    this._level = level;
  }

  /** @returns {string} */
  toString() {
    return this._pokemon.name + " Lv." + this._level;
  }
}

export { BattlerDummy };
