/**
 * Class representing a DV-range.
 * @todo store min and max values and sort the values
 */
class DVRange {
  /**
   * The DVs array, not necessarily in order.
   */
  private _dvs: number[];
  constructor() {
    this._dvs = [];
  }

  /**
   * Add a DV to the range.
   * @param dv  The added dv between [0, 15]
   */
  addDV(dv: number) {
    if (dv >= 0 && dv <= 15 && !this._dvs.includes(dv))
      this._dvs.push(dv);
  }

  /**
   * Get the minimum value of this range.
   * @returns The minimum value of this range.
   */
  getMin(): number {
    let min = 15;
    this._dvs.forEach(dv => {
      if (dv < min)
        min = dv;
    });
    return min;
  }

  /**
   * Get the maximum value of this range.
   * @returns The maximum value of this range.
   */
  getMax(): number {
    let max = 0;
    this._dvs.forEach(dv => {
      if (dv > max)
        max = dv;
    });
    return max;
  }

  get values(): number[] {
    let values: number[] = [];
    this._dvs.forEach(dv => values.push(dv));
    return values;
  }

  /**
   * Combine another range into this one.
   * @param dvRange The DVRange to combine this with.
   */
  combine(dvRange: DVRange) {
    let dvrThis = this;
    dvRange._dvs.forEach(dv => dvrThis.addDV(dv));
  }

  toString(): string {
    switch (this._dvs.length) {
      case 0:
        return '-';
      case 1:
        return this._dvs[0].toString();
      case 2:
        return this.getMin() + '/' + this.getMax();
      default:
        return this.getMin() + '-' + this.getMax();
    }
  }
}

export { DVRange };
