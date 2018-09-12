/**
 * Class representing an experience group
 * TODO expose to config file?
 * @abstract
 */
class AExperienceGroup {
  /**
   *
   * @param {string}  name
   */
  constructor(name) {
    if (new.target === AExperienceGroup) {
      throw new TypeError("Cannot construct AExperienceGroup instances directly");
    }
    /**
     * Name of the experience group.
     * @type {string}
     * @private
     */
    this._name = name;
    /**
     * Key of the experience group.
     * @type {string}
     * @private
     */
    this._key = name.toUpperCase().replace(" ", "_");
    /**
     * The experience group.
     * @type {number[]}
     * @private
     */
    this._expCurve = this._initExpCurve();
  }

  /**
   * @returns {number[]}
   * @private
   */
  _initExpCurve() {
    var ec = [];

    for (var l = 0; l < 101; l++)
      ec[l] = this._getExpForLevel(l);

    return ec;
  }

  /**
   * @param {number}    level
   * @returns {number}
   * @abstract
   * @private
   */
  _getExpForLevel(level) {
    throw new TypeError("_getExpForLevel not callable from super class");
  }

  /**
   * Get the difference in exp between two levels (taking exp into account).
   * @param {number}    fromLevel
   * @param {number}    toLevel
   * @param {number}    [levelExp=0]
   * @returns {number}  The difference in exp;
   */
  getDeltaExp(fromLevel, toLevel, levelExp = 0) {
    if (toLevel <= fromLevel) {
      return 0;
    } else {
      var exp = this.getTotalExp(toLevel) - this.getTotalExp(fromLevel, levelExp);
      return Math.max(exp, 0);
    }
  }

  /**
   * Get the level according to the total exp given?
   * @param {number}    totalExp
   * @returns {number}  The level.
   */
  getLevel(totalExp) {
    var l = 0;
    while (l <= 100 && this._expCurve[l] <= totalExp)
      l++;

    return l - 1;
  }

  /**
   * Get the experience already gained in the current level.
   * @param {number}    totalExp
   * @returns {number}  The experience already gained in the current level.
   */
  getLevelExp(totalExp) {
    var level = this.getLevel(totalExp);
    return totalExp - this._expCurve[level];
  }

  /**
   * Get the total experience for level and exp.
   * @param {number}    level
   * @param {number}    [levelExp=0]
   * @returns {number}  The total experience.
   */
  getTotalExp(level, levelExp = 0) {
    return this._expCurve[level] + levelExp;
  }

  /** @returns {string} */
  toString() {
    return this._name + " experience group";
  }
}

/**
 * Class representing the SLOW experience group
 * @augments AExperienceGroup
 */
class SlowExperienceGroup extends AExperienceGroup {
  constructor() {
    super("Slow");
  }

  /** @inheritdoc */
  _getExpForLevel(l) {
    return 5 * l * l * l / 4;
  }
}

/**
 * Class representing the MEDIUM_SLOW experience group
 * @augments AExperienceGroup
 */
class MediumSlowExperienceGroup extends AExperienceGroup {
  constructor() {
    super("Medium Slow");
  }

  /** @inheritdoc */
  _getExpForLevel(l) {
    return 6 * l * l * l / 5 - 15 * l * l + 100 * l - 140;
  }
}

/**
 * Class representing the MEDIUM_FAST experience group
 * @augments AExperienceGroup
 */
class MediumFastExperienceGroup extends AExperienceGroup {
  constructor() {
    super("Medium Fast");
  }

  /** @inheritdoc */
  _getExpForLevel(l) {
    return l * l * l;
  }
}

/**
 * Class representing the FAST experience group
 * @augments AExperienceGroup
 */
class FastExperienceGroup extends AExperienceGroup {
  constructor() {
    super("Fast");
  }

  /** @inheritdoc */
  _getExpForLevel(l) {
    return 4 * l * l * l / 5;
  }
}

/**
 * {SlowExperienceGroup, MediumSlowExperienceGroup, MediumFastExperienceGroup, FastExperienceGroup}
 * @type {{SlowExperienceGroup, MediumSlowExperienceGroup, MediumFastExperienceGroup, FastExperienceGroup}}
 */
const ExperienceGroup = {
  "Slow": new SlowExperienceGroup(),
  "Medium Slow": new MediumSlowExperienceGroup(),
  "Medium Fast": new MediumFastExperienceGroup(),
  "Fast": new FastExperienceGroup()
};

export default ExperienceGroup;
