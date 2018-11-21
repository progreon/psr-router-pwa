// TODO: player constructor?

const MIN_BADGE_BOOST = 0;
const MAX_BADGE_BOOST = 99;

/**
 * Class holding badge boosts
 */
class BadgeBoosts {
  /**
   *
   */
  constructor() {
    /**
     * The values
     * @type {number[]}
     * @private
     */
    this._values = [0, 0, 0, 0];
  }

  /**
   * Get the minimum badge boost.
   * @returns {number}  The minimum badge boost.
   */
  static MIN() {
      return MIN_BADGE_BOOST;
  }

  /**
   * Get the maximum badge boost.
   * @returns {number}  The maximum badge boost.
   */
  static MAX() {
      return MAX_BADGE_BOOST;
  }

  /**
   * Set the badge boost values.
   * @param {number}  atk   The attack badge boost.
   * @param {number}  def   The defense badge boost.
   * @param {number}  spd   The speed badge boost.
   * @param {number}  spc   The special badge boost.
   * @returns {BadgeBoosts} This object
   */
  setValues(atk, def, spd, spc) {
    atk = parseInt(atk);
    def = parseInt(def);
    spd = parseInt(spd);
    spc = parseInt(spc);
    this._values = [atk, def, spd, spc];

    for (var i = 0; i < this._values.length; i++)
      if (this._values[i] < BadgeBoosts.MIN())
        this._values[i] = BadgeBoosts.MIN();
      else if (this._values[i] > BadgeBoosts.MAX())
        this._values[i] = BadgeBoosts.MAX();

    return this;
  }

  /**
   * Get the attack badge boost.
   * @returns {number}  The attack badge boost.
   */
  atk() {
    return this._values[0];
  }

  /**
   * Get the defense badge boost.
   * @returns {number}  The defense badge boost.
   */
  def() {
    return this._values[1];
  }

  /**
   * Get the speed badge boost.
   * @returns {number}  The speed badge boost.
   */
  spd() {
    return this._values[2];
  }

  /**
   * Get the special badge boost.
   * @returns {number}  The special badge boost.
   */
  spc() {
    return this._values[3];
  }

  /**
   * Get a badge boost.
   * @param {number}  index   0:atk, 1:def, 2:spd, 3:spc
   * @returns {number}
   */
  getValue(index) {
    return this._values[parseInt(index)];
  }

  /** @returns {string} */
  toString() {
    return '[' + this.atk() + ', ' + this.def() + ', ' + this.spd() + ', ' + this.spc() + ']';
  }

  /** @returns {BadgeBoosts} */
  clone() {
    return new BadgeBoosts().setValues(this.atk(), this.def(), this.spd(), this.spc());
  }
}

export { BadgeBoosts };
