/**
 * Class holding a range of numbers and keeps count of how many per number.
 */
class Range {
  private _values: { [key: number]: number };
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
    this._values = {};
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
    Object.keys(range._values).forEach((value: any) => this.addValues(value, range._values[value]));
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
      for (let j = 0; j < this._values[i]; j++)
        vs.push(<number><any>i);

    vs.sort((a, b) => a - b);
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   * @param d The divider.
   * @returns The new range
   */
  divideBy(d: number, floor?: boolean): Range {
    let newRange: Range = new Range();

    Object.keys(this._values).forEach((value: any) => newRange.addValues(floor ? Math.floor(value / d) : value / d, this._values[value]));

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   * @param m The multiplier.
   * @returns The new range
   */
  multiplyBy(m: number, floor?: boolean): Range {
    let newRange: Range = new Range();

    Object.keys(this._values).forEach((value: any) => newRange.addValues(floor ? Math.floor(value * m) : value * m, this._values[value]));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param a The adder.
   * @returns The new range
   */
  add(a: number): Range {
    let newRange: Range = new Range();

    Object.keys(this._values).forEach((value: any) => newRange.addValues(+value + a, this._values[value]));

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

    for (let value1 in Object.keys(this._values))
      for (let value2 in Object.keys(ra._values))
        newRange.addValues(+value1 + +value2, this._values[value1] * ra._values[value2]);

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param s The substracter.
   * @returns The new range
   */
  substract(s: number): Range {
    let newRange: Range = new Range();

    Object.keys(this._values).forEach((value: any) => newRange.addValues(value - s, this._values[value]));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param rs  The range substracter.
   * @todo What is this used for?
   */
  substractRange(rs: Range): Range {
    let newRange = new Range();

    for (let value1 in this._values)
      for (let value2 in rs._values)
        newRange.addValues(+value1 - +value2, this._values[value1] * rs._values[value2]);

    return newRange;
  }

  /**
   * Returns a new range with the values floored.
   * @returns The new range
   */
  floor(): Range {
    let newRange = new Range();
    this.getValuesArray().forEach(v => newRange.addValue(Math.floor(v)));
    return newRange;
  }

  static parse(s: string): Range {
    let r = new Range();

    // TODO: possibilities?
    // example: 1-3,6,9-13
    let subValues = s.split(",").map(v => v.trim()).filter(v => v != "");
    subValues.forEach(subValue => {
      // example: 1-3 / 6 / 9-13
      let values = subValue.split("-").map(v => v.trim()).filter(v => v != "");
      if (values.length > 2) {
        values = [values[0], values[values.length - 1]];
      }
      if (isNaN(+values[0]) || isNaN(+values[values.length - 1])) {
        // ignore (or exception?)
      } else {
        let numberValues = [+values[0], +values[values.length - 1]];
        for (let v = numberValues[0]; v <= numberValues[1]; v++) {
          r.addValue(v);
        }
      }
    });

    return r;
  }

  toString(): string {
    if (this._min === this._max)
      return this._min + '';
    else
      return this._min + '-' + this._max;
  }

  clone(): Range {
    let range = new Range();
    range._values = this._values;
    range._count = this._count;
    range._min = this._min;
    range._max = this._max;
    return range;
  }
}

export { Range };
