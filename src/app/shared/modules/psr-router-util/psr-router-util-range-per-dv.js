import { Range } from './psr-router-range';

const DVS = 16;

/**
 * Class representing a number pair
 * TODO: test
 */
class RangePerDV {
  /**
   *
   */
  constructor() {
    /**
     * @type {number}
     * @private
     */
    this._count = 0;
    /**
     * @type {number}
     * @private
     */
    this._min = 0;
    /**
     * @type {number}
     * @private
     */
    this._max = 0;
    /**
     * The range for each DV
     * @type {Range[]}
     * @private
     */
    this._valuesPerDV = [];
    for (var i = 0; i < DVS; i++)
      this._valuesPerDV.push(new Range());
  }

  /**
   * Add a value to the range.
   * @param {number} dv
   * @param {number} value
   */
  addValue(dv, value) {
    dv = parseInt(dv);
    value = parseInt(value);

    if (dv < 0 || dv >= DVS)
      throw new RangeError("dv must be in range [0," + (DVS - 1) + "]!");

    this._valuesPerDV[dv].addValue(value);
    this._count++;

    if (this._count === 1)
      this._min = this._max = value;
    else if (value < this._min)
      this._min = value;
    else if (value > this._max)
      this._max = value;
  }

  /**
   * Add a range to a dv.
   * @param {number}  dv
   * @param {Range}   range
   */
  addValues(dv, range) {
    if (!(dv in this._valuesPerDV))
      this._valuesPerDV[dv] = range.clone();
    else
      this._valuesPerDV[dv].combine(range);

    this._count += range._count;
    this._min = Math._min(this._min, range._min);
    this._max = Math._max(this._max, range._max);
  }

  /**
   * Combine another range into this one.
   * @param {RangePerDV} rangePerDV
   */
  combine(rangePerDV) {
    for (var dv in rangePerDV._valuesPerDV)
      this.addValues(dv, rangePerDV._valuesPerDV[dv]);
  }

  /**
   * Checks if the given value falls between the min and max of this range.
   * @param {number} value
   * @returns {boolean}
   */
  containsValue(value) {
    return this._min <= value && value <= this._max;
  }

  /**
   * Checks if the given range has values between the min and max of this range.
   * @param {RangePerDV} range
   * @returns {boolean}
   */
  containsOneOf(range) {
    return (this._min <= range._min && range._min <= this._max)
        || (range._min <= this._min && this._min <= range._max);
  }

  /**
   * Get an array with all of the values.
   * @returns {number[]}  A sorted array with all the values.
   */
  getValuesArray() {
    var vs = [];

    for (var dv = 0; dv < this.DVS; dv++)
      if (dv in this._valuesPerDV)
        for (var val in this._valuesPerDV[dv].getValuesArray())
          vs.push(val);

    vs.sort(function(a, b) {
      return a - b;
    });
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   * @param {number}  d   The divider.
   * @returns {RangePerDV}
   */
  divideBy(d) {
    var newRange = new RangePerDV();

    for (var dv in this._valuesPerDV)
      newRange.addValues(dv, this._valuesPerDV[dv].divideBy(d));

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   * @param {number}  m   The multiplier.
   * @returns {RangePerDV}
   */
  multiplyBy(m) {
    var newRange = new RangePerDV();

    for (var dv in this._valuesPerDV)
      newRange.addValues(dv, this._valuesPerDV[dv].multiplyBy(m));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param {number}  a   The adder.
   * @returns {RangePerDV}
   */
  add(a) {
    var newRange = new RangePerDV();

    for (var dv in this._valuesPerDV)
      newRange.addValues(dv, this._valuesPerDV[dv].add(a));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param {RangePerDV}  ra  The range adder.
   * @returns {RangePerDV}
   */
  addRange(ra) {
    var newRange = new RangePerDV();

    for (var dv in this._valuesPerDV)
      newRange.addValues(dv, this._valuesPerDV[dv].addRange(ra._valuesPerDV[dv]));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param {number}  s   The substracter.
   * @returns {RangePerDV}
   */
  substract(s) {
    var newRange = new RangePerDV();

    for (var dv in this._valuesPerDV)
      newRange.addValues(dv, this._valuesPerDV[dv].substract(s));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param {RangePerDV}  rs  The range substracter.
   * @returns {RangePerDV}
   */
  substractRange(rs) {
    var newRange = new RangePerDV();

    for (var dv in this._valuesPerDV)
      newRange.addValues(dv, this._valuesPerDV[dv].substractRange(rs._valuesPerDV[dv]));

    return newRange;
  }

  /** @returns {String} */
  toString() {
    var str = '';

    for (var dv = 0; dv < this.DVS; dv++)
      if (dv in this._valuesPerDV)
        str += dv + ': ' + this._valuesPerDV[dv] + '<br />';
      else
        str += dv + ': -<br />';

    return str;
  }

  /** @returns {RangePerDV} */
  clone() {
    var rangePerDV = new RangePerDV();

    for (var dv in this._valuesPerDV)
      rangePerDV.addValues(dv, this._valuesPerDV[dv]);

    return rangePerDV;
  }
}

export default RangePerDV;
