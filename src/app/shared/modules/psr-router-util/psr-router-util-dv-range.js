/**
 * Class representing a DV-range.
 */
class DVRange {
  /**
   *
   */
  constructor() {
    /**
     * The DVs array, not necessarily in order.
     * @type {number[]}
     * @private
     */
    this._dvs = [];
  }

  /**
   * Add a DV to the range.
   * @param {number}  dv  The added dv between [0, 15]
   */
  addDV(dv) {
    dv = parseInt(dv);
    if (dv >= 0 && dv <= 15 && !this._dvs.includes(dv))
      this._dvs.push(dv);
  }

  /**
   * Get the minimum value of this range.
   * @returns {number}  The minimum value of this range.
   */
  getMin() {
    var min = 15;
    this._dvs.forEach(function(dv) {
      if (dv < min)
        min = dv;
    });
    return min;
  }

  /**
   * Get the maximum value of this range.
   * @returns {number}  The maximum value of this range.
   */
  getMax() {
    var max = 0;
    this._dvs.forEach(function(dv) {
      if (dv > max)
        max = dv;
    });
    return max;
  }

  /**
   * Combine another range into this one.
   * @param {DVRange}   dvRange   The DVRange to combine this with.
   */
  combine(dvRange) {
    var dvrThis = this;
    dvRange._dvs.forEach(function(dv) {
      dvrThis.addDV(dv);
    });
  }

  /** @returns {string} */
  toString() {
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

export default DVRange;
