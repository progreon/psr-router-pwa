/**
 * Class representing a battler
 * TODO: Change useCandy, useHPUP, ... to useItem?
 * @abstract
 */
class ABattler {
  /**
   *
   * @param {Game}          game          The game
   * @param {Pokemon}       pokemon       The pokemon
   * @param {EncounterArea} catchLocation The catch location of this battler (used for calculating possible DVs)
   * @param {boolean}       isTrainerMon  If it's a trainer's pokemon (TODO: do this more properly?)
   * @param {number}        level         The current level
   */
  constructor(game, pokemon, catchLocation, isTrainerMon, level) {
    if (new.target === ABattler) {
      throw new TypeError("Cannot construct ABattler instances directly");
    }
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
    /**
     * @type {move[]}
     * @protected
     */
    this._moveset = pokemon.getDefaultMoveset(level); // TODO: hold Move's or strings of keys for Move?
    /**
     * @type {number}
     * @protected
     */
    this._levelExp = 0;
  }

  /**
   * Defeat given battler, this battler is modified but not evolved.
   * @param {ABattler}  battler       The battler to defeat
   * @param {number}    participants  The number of participants in the battle (defaults to 1)
   * @returns {ABattler} Returns the modified/evolved battler (not a deep copy)
   * @abstract
   */
  defeatBattler(battler, participants = 1) {
    throw new TypeError("defeatBattler not callable from super class");
  }

  /**
   * Tries to evolve the battler with the specified item.
   * @param {Item}  item  The item which triggers the evolution
   * @returns {ABattler}   Returns the evolved battler or null if it couldn't evolve
   * @abstract
   */
  evolve(item) {
    throw new TypeError("evolve not callable from super class");
  }

  /**
   * Add experience, this battler is modified but not evolved.
   * @param {number}    exp
   * @returns {ABattler} Returns the modified/evolved ABattler (not a deep copy)
   * @abstract
   */
  addXP(exp) {
    throw new TypeError("addXP not callable from super class");
  }

  /**
   * Try to learn a TM or HM move.
   * TODO: Move or string?
   * TODO: (get via game): var canLearn = pokemon.getTMMoves().contains(newMove)
   * @param {Move}  newMove   The TM or HM move
   * @param {Move}  [oldMove]
   * @returns {boolean} Returns true if success.
   */
  learnTmMove(newMove, oldMove) {
    var success = false;
    var moves = this._moveset;
    var canLearn = false; // TODO
    if (canLearn && !moves.includes(newMove)) {
      if (!oldMove || moves.includes(oldMove)) {
        var i = 0;
        while ( i < 4 && oldMove != this._moveset[i] && this._moveset[i] != null)
          i++;
        // only remove the move if no more room!
        if (i < 4) {
          moveset[i] = newMove;
          success = true;
        }
      }
    }
    return success;
  }

  /**
   * Use some Rare Candies.
   * @param {number}    [count=1]
   * @returns {ABattler} Returns the modified/evolved ABattler (not a deep copy).
   */
  useCandy(count = 1) {
    if (!count)
      count = 1;

    var newBattler = this;
    for (var i = 0; i < count; i++)
      if (level < 100)
        newBattler = newBattler.addXP(this._game.experienceGroup[this._pokemon.expGroup].getDeltaExp(level, level + 1, levelExp));

    return newBattler;
  }

  /**
   * Use some HP Up.
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful.
   * @abstract
   */
  useHPUp(count = 1) {
    throw new TypeError("useHPUp not callable from super class");
  }

  /**
   * Use some Protein.
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful.
   * @abstract
   */
  useProtein(count = 1) {
    throw new TypeError("useProtein not callable from super class");
  }

  /**
   * Use some Iron.
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful.
   * @abstract
   */
  useIron(count = 1) {
    throw new TypeError("useIron not callable from super class");
  }

  /**
   * Use some Carbos.
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful.
   * @abstract
   */
  useCarbos(count = 1) {
    throw new TypeError("useCarbos not callable from super class");
  }

  /**
   * Use some Calcium.
   * @param {number}    [count=1]
   * @returns {boolean} Returns true if successful.
   * @abstract
   */
  useCalcium(count = 1) {
    throw new TypeError("useCalcium not callable from super class");
  }

  /**
   * Get the DV range for a stat.
   * @param {number}    stat    The stat index
   * @returns {DVRange} The current possible DVs for the stat.
   * @abstract
   */
  getDVRange(stat) {
    throw new TypeError("getDVRange not callable from super class");
  }

  /**
   * Get the DV range for a stat.
   * @returns {DVRange[]} The current possible DVs for the stat.
   * @abstract
   */
  getDVRanges() {
    throw new TypeError("getDVRanges not callable from super class");
  }

  /**
   * Get the current moveset.
   * @returns {Move[]} The current moveset.
   */
  getMoveset() {
    return this._moveset;
  }

  /**
   * Get the current level.
   * @returns {number} The current level.
   */
  getLevel() {
    return this._level;
  }

  /**
   * Get the current HP stat value.
   * @returns {Range} The current HP stat value.
   * @abstract
   */
  getHP() {
    throw new TypeError("getHP not callable from super class");
  }

  /**
   * Get the current attack stat value.
   * @returns {Range} The current attack stat value.
   * @abstract
   */
  getAtk() {
    throw new TypeError("getAtk not callable from super class");
  }

  /**
   * Get the current defense stat value.
   * @returns {Range} The current defense stat value.
   * @abstract
   */
  getDef() {
    throw new TypeError("getDef not callable from super class");
  }

  /**
   * Get the current speed stat value.
   * @returns {Range} The current speed stat value.
   * @abstract
   */
  getSpd() {
    throw new TypeError("getSpd not callable from super class");
  }

  /**
   * Get the current special stat value.
   * @returns {Range} The current special stat value.
   * @abstract
   */
  getSpc() {
    throw new TypeError("getSpc not callable from super class");
  }

  /**
   * Get the current special stat value.
   * @returns {Range} The current special stat value.
   * @abstract
   */
  getSpc() {
    throw new TypeError("getSpc not callable from super class");
  }

  /**
   * Get the current attack stat value with boosts.
   * @param {number}  badgeBoosts
   * @param {number}  stage
   * @return {Range}  The boosted attack stat value.
   */
  getBoostedAtk(badgeBoosts, stage) {
    return getBoostedStat(getAtk(), badgeBoosts, stage);
  }

  /**
   * Get the current defense stat value with boosts.
   * @param {number}  badgeBoosts
   * @param {number}  stage
   * @return {Range}  The boosted defense stat value.
   */
  getBoostedDef(badgeBoosts, stage) {
    return getBoostedStat(getDef(), badgeBoosts, stage);
  }

  /**
   * Get the current speed stat value with boosts.
   * @param {number}  badgeBoosts
   * @param {number}  stage
   * @return {Range}  The boosted speed stat value.
   */
  getBoostedSpd(badgeBoosts, stage) {
    return getBoostedStat(getSpd(), badgeBoosts, stage);
  }

  /**
   * Get the current special stat value with boosts.
   * @param {number}  badgeBoosts
   * @param {number}  stage
   * @return {Range}  The boosted special stat value.
   */
  getBoostedSpc(badgeBoosts, stage) {
    return getBoostedStat(getSpc(), badgeBoosts, stage);
  }

  /**
   * Get the current stat value with boosts.
   * @param {Range}   statRange
   * @param {number}  badgeBoostCount
   * @param {number}  xItemCount
   * @returns {Range} The current stat value with boosts.
   * @abstract
   */
  getBoostedStat(statRange, badgeBoostCount, xItemCount) {
    throw new TypeError("getSpc not callable from super class");
  }

  /**
   * Get the pokemon object.
   * @returns {Pokemon} The pokemon object.
   */
  getPokemon() {
    return this._pokemon;
  }

  /**
   * Check if the battler has the given type.
   * @param {Type}  type
   * @return {boolean}  Returns true if the battler has the given type.
   */
  isType(type) {
    return type == this._pokemon.type1 || (this._pokemon.type2 != null && type == this._pokemon.type2);
  }

  /**
   * Get the experience a battler gets for battling this pokemon.
   * @param {number}  participants  The number of participants in the battle.
   * @returns {number}  The experience.
   */
  getExp(participants) {
    return this._pokemon.getExp(this._level, participants, false, this._isTrainerMon);
  }

  /**
   * Get the current experience within the current level.
   * @returns {number}  The current experience within the current level.
   */
  getLevelExp() {
    return this._levelExp;
  }

  /** @returns {ABattler} */
  equals(battler) {
    // TODO
  }

  /** @returns {string} */
  toString() {
    return this._pokemon.name + " Lv." + this.getLevel();
  }

  /**
   * @returns {ABattler} The clone.
   * @abstract
   */
  clone() {
    throw new TypeError("clone not callable from super class");
    // var clone = new ABattler(this._game, this._pokemon, this._catchLocation, this._isTrainerMon, this._level);
    // // TODO: clone._moveset = ...;
    // clone._levelExp = this._levelExp;
  }
}

export { ABattler };
