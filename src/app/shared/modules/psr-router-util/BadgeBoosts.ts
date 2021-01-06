/**
 * Class holding badge boosts
 */
class BadgeBoosts {
  public static readonly MIN: number = 0;
  public static readonly MAX: number = 99;
  private _values: { [key: string]: number };
  get values() { return this._values; }

  constructor() {
    this._values = {};
  }

  public setBoosts(boosts: string[] = []) {
    this._values = {};
    boosts.forEach(b => this._values[b.toUpperCase()] = 1);
  }

  /**
   * Get a badge boost.
   * @param boost e.g. atk, def, spd, spc
   * @returns The badge boost
   */
  public getBoost(boost: string): number {
    return boost ? this._values[boost.toUpperCase()] || 0 : 0;
  }

  //// SOME GEN 1 STUFF ////
  
  public gen1ApplyAllAndReset(boost: string) {
    Object.keys(this._values).forEach(b => {
      if (b !== boost?.toUpperCase()) {
        if (this._values[b] > 0) {
          this._values[b]++;
        }
      } else if (this._values[b] > 0) {
        this._values[b] = 1;
      }
    });
  }

  public get atk(): number {
    return this._values["ATK"] || 0;
  }
  public set atk(value: number) {
    if (!this._values["ATK"]) {
      this._values["ATK"] = 0;
    }
    this._values["ATK"] = value;
  }

  public get def(): number {
    return this._values["DEF"] || 0;
  }
  public set def(value: number) {
    if (!this._values["DEF"]) {
      this._values["DEF"] = 0;
    }
    this._values["DEF"] = value;
  }

  public get spd(): number {
    return this._values["SPD"] || 0;
  }
  public set spd(value: number) {
    if (!this._values["SPD"]) {
      this._values["SPD"] = 0;
    }
    this._values["SPD"] = value;
  }

  public get spc(): number {
    return this._values["SPC"] || 0;
  }
  public set spc(value: number) {
    if (!this._values["SPC"]) {
      this._values["SPC"] = 0;
    }
    this._values["SPC"] = value;
  }

  public toString(): string {
    return '[' + Object.keys(this._values).map(k => `${k}:${this._values[k]}`).join(", ") + ']';
  }

  public clone(): BadgeBoosts {
    let newBB = new BadgeBoosts();
    Object.keys(this._values).forEach(k => newBB._values[k] = this._values[k]);
    return newBB;
  }
}

export { BadgeBoosts };
