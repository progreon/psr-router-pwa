/**
 * Class holding a range of numbers and keeps count of how many per number.
 *
 * @class
 */
export default class Range {
  constructor() {
    this.values = {};
    this.count = 0;
    this.min = 0;
    this.max = 0;
  }

  /**
   * Add a value to the range.
   *
   * @param {number} value
   * @returns {undefined}
   */
  addValue(value) {
    value = parseInt(value);

    if (!(value in this.values))
      this.values[value] = 1;
    else
      this.values[value]++;

    this.count++;

    if (this.count === 1)
      this.min = this.max = value;
    else if (value < this.min)
      this.min = value;
    else if (value > this.max)
      this.max = value;
  }

  /**
   * Add a value multiple times to the range.
   *
   * @param {number} value
   * @param {number} count
   * @returns {undefined}
   */
  addValues(value, count) {
    for (var i = 0; i < parseInt(count); i++)
      this.addValue(value);
  }

  /**
   * Combine another range into this one.
   *
   * @param {Range} range
   * @returns {undefined}
   */
  combine(range) {
    for (var value in range.values)
      this.addValues(value, range.values[value]);
  }

  /**
   * Checks if the given value falls between the min and max of this range.
   *
   * @param {number} value
   * @returns {Boolean}
   */
  containsValue(value) {
    return this.min <= parseInt(value) && parseInt(value) <= this.max;
  }

  /**
   * Checks if the given range has values between the min and max of this range.
   *
   * @param {Range} range
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

    for (var i in this.values)
      for (var j = 0; j < this.values[i]; j++)
        vs.push(i);

    vs.sort(function(a, b) {
      return a - b;
    });
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   *
   * @param {number} d
   * @returns {Range}
   */
  divideBy(d) {
    var newRange = new Range();

    for (var value in this.values)
      newRange.addValues(value / d, this.values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   *
   * @param {number} m
   * @returns {Range}
   */
  multiplyBy(m) {
    var newRange = new Range();

    for (var value in this.values)
      newRange.addValues(value * m, this.values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   *
   * @param {number} a
   * @returns {Range}
   */
  add(a) {
    var newRange = new Range();

    for (var value in this.values)
      newRange.addValues(+value + +a, this.values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   *
   * @param {Range} ra
   * @returns {Range}
   */
  addRange(ra) {
    var newRange = new Range();

    for (var value1 in this.values)
      for (var value2 in ra.values)
        newRange.addValues(+value1 + +value2, this.values[value1] * ra.values[value2]);

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   *
   * @param {number} s
   * @returns {Range}
   */
  substract(s) {
    var newRange = new Range();

    for (var value in this.values)
      newRange.addValues(value - s, this.values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   *
   * @param {Range} rs
   * @returns {Range}
   */
  substractRange(rs) {
    var newRange = new Range();

    for (var value1 in this.values)
      for (var value2 in rs.values)
        newRange.addValues(value1 - value2, this.values[value1] * rs.values[value2]);

    return newRange;
  }

  /**
   *
   * @returns {String}
   */
  toString() {
    if (this.min === this.max)
      return this.min;
    else
      return this.min + '-' + this.max;
  }

  /**
   *
   * @returns {Range}
   */
  clone() {
    var range = new Range();
    range.values = this.values;
    range.count = this.count;
    range.min = this.min;
    range.max = this.max;
    return range;
  }
}
