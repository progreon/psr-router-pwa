/**
 * Class holding a range of numbers and keeps count of how many per number.
 */
class Range {
  /**
   *
   */
  constructor() {
    /**
     * @type {number[][]}
     * @private
     */
    this._values = {};
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
  }

  /**
   * Add a value to the range.
   * @param {number} value
   */
  addValue(value) {
    value = parseInt(value);

    if (!(value in this._values))
      this._values[value] = 1;
    else
      this._values[value]++;

    this._count++;

    if (this._count === 1)
      this._min = this._max = value;
    else if (value < this._min)
      this._min = value;
    else if (value > this._max)
      this._max = value;
  }

  /**
   * Add a value multiple times to the range.
   * @param {number} value
   * @param {number} count
   */
  addValues(value, count) {
    for (var i = 0; i < parseInt(count); i++)
      this.addValue(value);
  }

  /**
   * Combine another range into this one.
   * @param {Range} range
   */
  combine(range) {
    for (var value in range._values)
      this.addValues(value, range._values[value]);
  }

  /**
   * Checks if the given value falls between the min and max of this range.
   * @param {number} value
   * @returns {boolean}
   */
  containsValue(value) {
    return this._min <= parseInt(value) && parseInt(value) <= this._max;
  }

  /**
   * Checks if the given range has values between the min and max of this range.
   * @param {Range} range
   * @returns {boolean}
   */
  containsOneOf(range) {
    return (this._min <= range._min && range._min <= this._max)
        || (range._min <= this._min && this._min <= range._max);
  }

  /**
   * Get an array with all of the values.
   * @returns {number[]}  The array with all the values.
   */
  getValuesArray() {
    var vs = [];

    for (var i in this._values)
      for (var j = 0; j < this._values[i]; j++)
        vs.push(i);

    vs.sort(function(a, b) {
      return a - b;
    });
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   * @param {number}  d   The divider.
   * @returns {Range}
   */
  divideBy(d) {
    var newRange = new Range();

    for (var value in this._values)
      newRange.addValues(value / d, this._values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   * @param {number}  m   The multiplier.
   * @returns {Range}
   */
  multiplyBy(m) {
    var newRange = new Range();

    for (var value in this._values)
      newRange.addValues(value * m, this._values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param {number}  a   The adder.
   * @returns {Range}
   */
  add(a) {
    var newRange = new Range();

    for (var value in this._values)
      newRange.addValues(+value + +a, this._values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param {Range}  ra  The range adder.
   * @returns {Range}
   */
  addRange(ra) {
    var newRange = new Range();

    for (var value1 in this._values)
      for (var value2 in ra._values)
        newRange.addValues(+value1 + +value2, this._values[value1] * ra._values[value2]);

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param {number}  s   The substracter.
   * @returns {Range}
   */
  substract(s) {
    var newRange = new Range();

    for (var value in this._values)
      newRange.addValues(value - s, this._values[value]);

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param {Range}  rs  The range substracter.
   * @returns {Range}
   */
  substractRange(rs) {
    var newRange = new Range();

    for (var value1 in this._values)
      for (var value2 in rs._values)
        newRange.addValues(value1 - value2, this._values[value1] * rs._values[value2]);

    return newRange;
  }

  /** @returns {string} */
  toString() {
    if (this._min === this._max)
      return this._min;
    else
      return this._min + '-' + this._max;
  }

  /** @returns {Range} */
  clone() {
    var range = new Range();
    range._values = this._values;
    range._count = this._count;
    range._min = this._min;
    range._max = this._max;
    return range;
  }
}

export default Range;
