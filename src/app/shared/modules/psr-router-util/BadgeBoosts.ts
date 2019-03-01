/**
 * Class holding badge boosts
 */
class BadgeBoosts {
  public static readonly MIN: number = 0;
  public static readonly MAX: number = 99;
  private _values: number[];
  get values(): number[] {
    return this._values;
  }
  /**
   *
   */
  constructor() {
    this._values = [0, 0, 0, 0];
  }

  /**
   * Set the badge boost values.
   * @param atk The attack badge boost.
   * @param def The defense badge boost.
   * @param spd The speed badge boost.
   * @param spc The special badge boost.
   * @returns This object
   */
  setValues(atk: number, def: number, spd: number, spc: number): BadgeBoosts {
    // atk = parseInt(atk);
    // def = parseInt(def);
    // spd = parseInt(spd);
    // spc = parseInt(spc);
    this._values = [atk, def, spd, spc];

    for (let i = 0; i < this._values.length; i++)
      if (this._values[i] < BadgeBoosts.MIN)
        this._values[i] = BadgeBoosts.MIN;
      else if (this._values[i] > BadgeBoosts.MAX)
        this._values[i] = BadgeBoosts.MAX;

    return this;
  }

  /**
   * Get the attack badge boost.
   * @returns The attack badge boost.
   */
  atk(): number {
    return this._values[0];
  }

  /**
   * Get the defense badge boost.
   * @returns The defense badge boost.
   */
  def(): number {
    return this._values[1];
  }

  /**
   * Get the speed badge boost.
   * @returns The speed badge boost.
   */
  spd(): number {
    return this._values[2];
  }

  /**
   * Get the special badge boost.
   * @returns The special badge boost.
   */
  spc(): number {
    return this._values[3];
  }

  /**
   * Get a badge boost.
   * @param index 0:atk, 1:def, 2:spd, 3:spc
   * @returns The badge boost
   */
  getValue(index: number): number {
    return this._values[index];
  }

  toString(): string {
    return '[' + this.atk() + ', ' + this.def() + ', ' + this.spd() + ', ' + this.spc() + ']';
  }

  clone(): BadgeBoosts {
    return new BadgeBoosts().setValues(this.atk(), this.def(), this.spd(), this.spc());
  }
}

export { BadgeBoosts };
