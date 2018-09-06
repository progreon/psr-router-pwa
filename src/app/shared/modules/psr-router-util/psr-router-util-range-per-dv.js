const DVS = 16;

/**
 * Class representing a number pair
 * TODO: test
 *
 * @class
 */
export default class RangePerDV {
  constructor() {
    this.count = 0;
    this.min = 0;
    this.max = 0;
    this.valuesPerDV = [];
    for (var i = 0; i < DVS; i++)
      this.valuesPerDV.push(new Range());
  }

  /**
   * Add a value to the range.
   *
   * @param {number} dv
   * @param {number} value
   * @returns {undefined}
   */
  addValue(dv, value) {
    dv = parseInt(dv);
    value = parseInt(value);

    if (dv < 0 || dv >= DVS)
      throw new RangeError("dv must be in range [0," + (DVS - 1) + "]!");

    this.valuesPerDV[dv].addValue(value);
    this.count++;

    if (this.count === 1)
      this.min = this.max = value;
    else if (value < this.min)
      this.min = value;
    else if (value > this.max)
      this.max = value;
  }

  /**
   * Add a range to a dv.
   *
   * @param {number} dv
   * @param {RangePerDV} range
   * @returns {undefined}
   */
  addValues(dv, range) {
    if (!(dv in this.valuesPerDV))
      this.valuesPerDV[dv] = range.clone();
    else
      this.valuesPerDV[dv].combine(range);

    this.count += range.count;
    this.min = Math.min(this.min, range.min);
    this.max = Math.max(this.max, range.max);
  }

  /**
   * Combine another range into this one
   * @param {RangePerDV} rangePerDV
   * @returns {undefined}
   */
  combine(rangePerDV) {
    for (var dv in rangePerDV.valuesPerDV)
      this.addValues(dv, rangePerDV.valuesPerDV[dv]);
  }

  /**
   * Checks if the given value falls between the min and max of this range.
   *
   * @param {number} value
   * @returns {Boolean}
   */
  containsValue(value) {
    return this.min <= value && value <= this.max;
  }

  /**
   * Checks if the given range has values between the min and max of this range.
   *
   * @param {RangePerDV} range
   * @returns {Boolean}
   */
  containsOneOf(range) {
    return (this.min <= range.min && range.min <= this.max)
        || (range.min <= this.min && this.min <= range.max);
  }

  /**
   * Get an array with all of the values;
   *
   * @returns {Array}
   */
  getValuesArray() {
    var vs = [];

    for (var dv = 0; dv < this.DVS; dv++)
      if (dv in this.valuesPerDV)
        for (var val in this.valuesPerDV[dv].getValuesArray())
          vs.push(val);

    vs.sort(function(a, b) {
      return a - b;
    });
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   *
   * @param {number} d
   * @returns {RangePerDV}
   */
  divideBy(d) {
    var newRange = new RangePerDV();

    for (var dv in this.valuesPerDV)
      newRange.addValues(dv, this.valuesPerDV[dv].divideBy(d));

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   *
   * @param {number} m
   * @returns {RangePerDV}
   */
  multiplyBy(m) {
    var newRange = new RangePerDV();

    for (var dv in this.valuesPerDV)
      newRange.addValues(dv, this.valuesPerDV[dv].multiplyBy(m));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   *
   * @param {number} a
   * @returns {RangePerDV}
   */
  add(a) {
    var newRange = new RangePerDV();

    for (var dv in this.valuesPerDV)
      newRange.addValues(dv, this.valuesPerDV[dv].add(a));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   *
   * @param {RangePerDV} ra
   * @returns {RangePerDV}
   */
  addRange(ra) {
    var newRange = new RangePerDV();

    for (var dv in this.valuesPerDV)
      newRange.addValues(dv, this.valuesPerDV[dv].addRange(ra.valuesPerDV[dv]));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   *
   * @param {number} s
   * @returns {RangePerDV}
   */
  substract(s) {
    var newRange = new RangePerDV();

    for (var dv in this.valuesPerDV)
      newRange.addValues(dv, this.valuesPerDV[dv].substract(s));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   *
   * @param {RangePerDV} rs
   * @returns {RangePerDV}
   */
  substractRange(rs) {
    var newRange = new RangePerDV();

    for (var dv in this.valuesPerDV)
      newRange.addValues(dv, this.valuesPerDV[dv].substractRange(rs.valuesPerDV[dv]));

    return newRange;
  }

  /**
   *
   * @returns {String}
   */
  toString() {
    var str = '';

    for (var dv = 0; dv < this.DVS; dv++)
      if (dv in this.valuesPerDV)
        str += dv + ': ' + this.valuesPerDV[dv] + '<br />';
      else
        str += dv + ': -<br />';

    return str;
  }

  clone() {
    var rangePerDV = new RangePerDV();

    for (var dv in this.valuesPerDV)
      rangePerDV.addValues(dv, this.valuesPerDV[dv]);

    return rangePerDV;
  }
}
