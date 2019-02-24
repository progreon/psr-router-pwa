/**
 * Class holding stages.
 */
class Stages {
  public static readonly MIN = -6;
  public static readonly MAX = 6;
  private _values: number[];
  /**
   *
   */
  constructor() {
    this._values = [0, 0, 0, 0];
  }

  /**
   * Set the stages and returns this object.
   * (for example, you can run: var stages = new Stages().set(atk, def, spd, spc);)
   * @returns {Stages}
   */
  setStages(atk: number, def: number, spd: number, spc: number): Stages {
    if (atk < Stages.MIN || def < Stages.MIN || spd < Stages.MIN || spc < Stages.MIN
        || atk > Stages.MAX || def > Stages.MAX || spd > Stages.MAX || spc > Stages.MAX)
      throw new RangeError("stages must be in range [" + Stages.MIN + "," + Stages.MAX + "]!");

    this._values = [atk, def, spd, spc];
    return this;
  }

  /**
   * Get the attack stage.
   */
  atk(): number {
    return this._values[0];
  }

  /**
   * Get the defense stage.
   */
  def(): number {
    return this._values[1];
  }

  /**
   * Get the speed stage.
   */
  spd(): number {
    return this._values[2];
  }

  /**
   * Get the special stage.
   */
  spc(): number {
    return this._values[3];
  }

  /**
   * Get a value.
   * @param index 0:atk, 1:def, 2:spd, 3:spc
   */
  getValue(index: number): number {
    if (index < 0 || index >= 4)
      throw new RangeError("index must be in range [0,3]!");

    return this._values[index];
  }

  toString(): string {
    return "{atk:" + this.atk() + ", def:" + this.def() + ", spd:" + this.spd() + ", spc:" + this.spc() + "}";
  }

  clone(): Stages {
    return new Stages().setStages(this.atk(), this.def(), this.spd(), this.spc());
  }
}

export { Stages };
