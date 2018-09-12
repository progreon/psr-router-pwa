const MIN_STAGE = -6;
const MAX_STAGE = 6;

/**
 * Class holding stages.
 */
class Stages {
  /**
   *
   */
  constructor() {
    /**
     * @type {number[]}
     * @private
     */
    this._values = [0, 0, 0, 0];
  }

  /**
   * Get the minimum stat stage.
   * @returns {number}  The minimum stat stage.
   */
  static MIN() {
    return MIN_STAGE;
  }

  /**
   * Get the minimum stat stage.
   * @returns {number}  The minimum stat stage.
   */
  static MAX() {
    return MAX_STAGE;
  }

  /**
   * Set the stages and returns this object.
   * (for example, you can run: var stages = new Stages().set(atk, def, spd, spc);)
   * @param {number} atk
   * @param {number} def
   * @param {number} spd
   * @param {number} spc
   * @returns {Stages}
   */
  setStages(atk, def, spd, spc) {
    atk = parseInt(atk);
    def = parseInt(def);
    spd = parseInt(spd);
    spc = parseInt(spc);

    if (atk < Stages.MIN() || def < Stages.MIN() || spd < Stages.MIN() || spc < Stages.MIN()
        || atk > Stages.MAX() || def > Stages.MAX() || spd > Stages.MAX() || spc > Stages.MAX())
      throw new RangeError("stages must be in range [" + Stages.MIN() + "," + Stages.MAX() + "]!");

    this._values = [atk, def, spd, spc];
    return this;
  }

  /**
   * Get the attack stage.
   * @returns {number}
   */
  atk() {
    return this._values[0];
  }

  /**
   * Get the defense stage.
   * @returns {number}
   */
  def() {
    return this._values[1];
  }

  /**
   * Get the speed stage.
   * @returns {number}
   */
  spd() {
    return this._values[2];
  }

  /**
   * Get the special stage.
   * @returns {number}
   */
  spc() {
    return this._values[3];
  }

  /**
   * Get a value.
   * @param {number}  index   0:atk, 1:def, 2:spd, 3:spc
   * @returns {number}
   */
  getValue(index) {
    index = parseInt(index);

    if (index < 0 || index >= 4)
      throw new RangeError("index must be in range [0,3]!");

    return this._values[index];
  }

  /** @returns {string} */
  toString() {
    return "{atk:" + this.atk() + ", def:" + this.def() + ", spd:" + this.spd() + ", spc:" + this.spc() + "}";
  }

  /** @returns {Stages} */
  clone() {
    return new Stages().setStages(this.atk(), this.def(), this.spd(), this.spc());
  }
}

export default Stages;
