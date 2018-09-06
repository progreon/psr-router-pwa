/**
 * Class representing a DV-range
 *
 * @class
 */
export default class DVRange {
  /**
   *
   * @returns {DVRange}
   */
  constructor() {
    /**
     * The DVs array, not necessarily in order
     */
    this._dvs = [];
  }

  /**
   *
   * @param {Number} dv [0, 15]
   * @returns {undefined}
   */
  addDV(dv) {
    dv = parseInt(dv);
    if (dv >= 0 && dv <= 15 && !this._dvs.includes(dv))
      this._dvs.push(dv);
  }

  /**
   * Returns the minimum value of this range
   * @returns {number}
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
   * Returns the maximum value of this range
   * @returns {number}
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
   * Combine another range into this one
   * @param {DVRange} dvRange
   * @returns {undefined}
   */
  combine(dvRange) {
    var dvrThis = this;
    dvRange._dvs.forEach(function(dv) {
      dvrThis.addDV(dv);
    });
  }

  /**
   *
   * @returns {String}
   */
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
