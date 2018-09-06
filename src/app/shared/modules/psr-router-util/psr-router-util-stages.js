const MIN_STAGE = -6;
const MAX_STAGE = 6;

/**
 * Class holding stages
 *
 * @class
 */
export default class Stages {
  constructor() {
    this.values = [0, 0, 0, 0];
  }

  static MIN() {
    return MIN_STAGE;
  }

  static MAX() {
    return MAX_STAGE;
  }

  /**
   * Set the stages and returns this object.
   * (for example, you can run: var stages = new Stages().set(atk, def, spd, spc);)
   *
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

    this.values = [atk, def, spd, spc];
    return this;
  }

  /**
   * Returns the attack stage.
   *
   * @returns {number}
   */
  atk() {
    return this.values[0];
  }

  /**
   * Returns the defense stage.
   *
   * @returns {number}
   */
  def() {
    return this.values[1];
  }

  /**
   * Returns the speed stage.
   *
   * @returns {number}
   */
  spd() {
    return this.values[2];
  }

  /**
   * Returns the special stage.
   *
   * @returns {number}
   */
  spc() {
    return this.values[3];
  }

  /**
   *
   * @param {number} index 0:atk, 1:def, 2:spd, 3:spc
   * @returns {number}
   */
  getValue(index) {
    index = parseInt(index);

    if (index < 0 || index >= 4)
      throw new RangeError("index must be in range [0,3]!");

    return this.values[index];
  }

  toString() {
    return "{atk:" + this.atk() + ", def:" + this.def() + ", spd:" + this.spd() + ", spc:" + this.spc() + "}";
  }

  clone() {
    return new Stages().setStages(this.atk(), this.def(), this.spd(), this.spc());
  }
}
