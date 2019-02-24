/**
 * Class representing an experience group
 * TODO expose to config file?
 * @abstract
 */
export abstract class ExperienceGroup {
  /**
   * Key of the experience group
   */
  public readonly key: string;
  /**
   * The experience for each level
   */
  private readonly _expCurve: number[];
  /**
   *
   * @param name
   */
  constructor(public readonly name: string) {
    this.key = name.toUpperCase().replace(" ", "_");
    this._expCurve = this._initExpCurve();
  }
  /**
   *
   * @returns {number[]}
   */
  private _initExpCurve(): number[] {
    let ec = [];
    for (var l = 0; l < 101; l++)
      ec[l] = this._getExpForLevel(l);
    return ec;
  }
  /**
   * @param level
   * @returns
   */
  abstract _getExpForLevel(level: number): number;
  /**
   * Get the difference in exp between two levels (taking exp into account).
   * @param fromLevel
   * @param toLevel
   * @param levelExp
   * @returns The difference in exp;
   */
  getDeltaExp(fromLevel: number, toLevel: number, levelExp: number = 0): number {
    if (toLevel <= fromLevel) {
      return 0;
    }
    else {
      let exp = this.getTotalExp(toLevel) - this.getTotalExp(fromLevel, levelExp);
      return Math.max(exp, 0);
    }
  }
  /**
   * Get the level according to the total exp given?
   * @param totalExp
   * @returns The level.
   */
  getLevel(totalExp: number): number {
    let l = 0;
    while (l <= 100 && this._expCurve[l] <= totalExp)
      l++;
    return l - 1;
  }
  /**
   * Get the experience already gained in the current level.
   * @param totalExp
   * @returns The experience already gained in the current level.
   */
  getLevelExp(totalExp: number): number {
    let level = this.getLevel(totalExp);
    return totalExp - this._expCurve[level];
  }
  /**
   * Get the total experience for level and exp.
   * @param level
   * @param levelExp
   * @returns The total experience.
   */
  getTotalExp(level: number, levelExp: number = 0): number {
    return this._expCurve[level] + levelExp;
  }
  toString(): string {
    return `${this.name} experience group`;
  }
}
