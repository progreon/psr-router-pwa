/**
 * Class holding a range of numbers and keeps count of how many per number.
 */
class Range {
  private _values: Map<number, number>;
  private _count: number;
  public get count() {
    return this._count;
  }
  private _min: number;
  public get min() {
    return this._min;
  }
  private _max: number;
  public get max() {
    return this._max;
  }
  /**
   *
   */
  constructor() {
    this._values = new Map();
    this._count = 0;
    this._min = 0;
    this._max = 0;
  }

  /**
   * Add a value to the range.
   * @param value
   */
  addValue(value: number) {
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
   * @param value
   * @param count
   */
  addValues(value: number, count: number) {
    for (let i = 0; i < count; i++)
      this.addValue(value);
  }

  /**
   * Combine another range into this one.
   * @param range
   */
  combine(range: Range) {
    range._values.forEach((count, value) => this.addValues(value, count));
  }

  /**
   * Checks if the given value falls between the min and max of this range.
   * @param value
   */
  containsValue(value: number): boolean {
    return this._min <= value && value <= this._max;
  }

  /**
   * Checks if the given range has values between the min and max of this range.
   * @param range
   */
  containsOneOf(range: Range): boolean {
    return (this._min <= range._min && range._min <= this._max) ||
            (range._min <= this._min && this._min <= range._max);
  }

  /**
   * Get an array with all of the values.
   * @returns The array with all the values.
   */
  getValuesArray(): number[] {
    let vs: number[] = [];

    for (let i in this._values)
      vs.push(this._values[i]);

    vs.sort((a, b) => a - b);
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   * @param d The divider.
   * @returns The new range
   */
  divideBy(d: number): Range {
    let newRange: Range = new Range();

    this._values.forEach((count, value) => newRange.addValues(value / d, count));

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   * @param m The multiplier.
   * @returns The new range
   */
  multiplyBy(m: number): Range {
    let newRange: Range = new Range();

    this._values.forEach((count, value) => newRange.addValues(value * m, count));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param a The adder.
   * @returns The new range
   */
  add(a: number): Range {
    let newRange: Range = new Range();

    this._values.forEach((count, value) => newRange.addValues(value + a, count));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param ra  The range adder.
   * @returns The new range
   * @todo What is this used for?
   */
  addRange(ra: Range): Range {
    let newRange: Range = new Range();

    for (let value1 in this._values.keys())
      for (let value2 in ra._values.keys())
        newRange.addValues(+value1 + +value2, this._values[value1] * ra._values[value2]);

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param s The substracter.
   * @returns The new range
   */
  substract(s: number): Range {
    var newRange: Range = new Range();

    this._values.forEach((count, value) => newRange.addValues(value - s, count));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param rs  The range substracter.
   * @todo What is this used for?
   */
  substractRange(rs: Range): Range {
    var newRange = new Range();

    for (var value1 in this._values)
      for (var value2 in rs._values)
        newRange.addValues(+value1 - +value2, this._values[value1] * rs._values[value2]);

    return newRange;
  }

  toString(): string {
    if (this._min === this._max)
      return this._min + '';
    else
      return this._min + '-' + this._max;
  }

  clone(): Range {
    var range = new Range();
    range._values = this._values;
    range._count = this._count;
    range._min = this._min;
    range._max = this._max;
    return range;
  }
}

export { Range };
