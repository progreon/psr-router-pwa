// TODO: player constructor?

const MIN_BADGE_BOOST = 0;
const MAX_BADGE_BOOST = 99;

/**
 * Class holding badge boosts
 *
 * @class
 */
export default class BadgeBoosts {
  /**
   *
   * @returns {BadgeBoosts}
   */
  constructor() {
    this._values = [0, 0, 0, 0];
  }

  static MIN() {
      return MIN_BADGE_BOOST;
  }

  static MAX() {
      return MAX_BADGE_BOOST;
  }

  /**
   *
   * @param {type} atk
   * @param {type} def
   * @param {type} spd
   * @param {type} spc
   * @returns {BadgeBoosts}
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
   * Returns the attack badge boost.
   *
   * @returns {number}
   */
  atk() {
    return this._values[0];
  }

  /**
   * Returns the defense badge boost.
   *
   * @returns {number}
   */
  def() {
    return this._values[1];
  }

  /**
   * Returns the speed badge boost.
   *
   * @returns {number}
   */
  spd() {
    return this._values[2];
  }

  /**
   * Returns the special badge boost.
   *
   * @returns {number}
   */
  spc() {
    return this._values[3];
  }

  /**
   *
   * @param {number} index 0:atk, 1:def, 2:spd, 3:spc
   * @returns {number}
   */
  getValue(index) {
    return this._values[parseInt(index)];
  }

  toString() {
    return '[' + this.atk() + ', ' + this.def() + ', ' + this.spd() + ', ' + this.spc() + ']';
  }

  /**
   *
   * @returns {BadgeBoosts}
   */
  clone() {
    return new BadgeBoosts().setValues(this.atk(), this.def(), this.spd(), this.spc());
  }
}
