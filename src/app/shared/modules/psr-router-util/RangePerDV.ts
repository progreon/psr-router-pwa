import { Range } from '.';

/**
 * Class representing a number pair
 * TODO: test
 */
class RangePerDV {
  public static readonly DVS = 16;
  private _count: number;
  private _min: number;
  private _max: number;
  private _valuesPerDV: Range[];
  /**
   *
   */
  constructor() {
    this._count = 0;
    this._min = 0;
    this._max = 0;
    this._valuesPerDV = [];
    for (let i = 0; i < RangePerDV.DVS; i++)
      this._valuesPerDV.push(new Range());
  }

  /**
   * Add a value to the range.
   * @param dv
   * @param value
   */
  addValue(dv: number, value: number) {
    if (dv < 0 || dv >= RangePerDV.DVS)
      throw new RangeError("dv must be in range [0," + (RangePerDV.DVS - 1) + "]!");

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
   * @param dv
   * @param range
   */
  addValues(dv: number, range: Range) {
    if (!(dv in this._valuesPerDV))
      this._valuesPerDV[dv] = range.clone();
    else
      this._valuesPerDV[dv].combine(range);

    this._count += range.count;
    this._min = Math.min(this._min, range.min);
    this._max = Math.max(this._max, range.max);
  }

  /**
   * Combine another range into this one.
   * @param rangePerDV
   */
  combine(rangePerDV: RangePerDV) {
    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      this.addValues(dv, rangePerDV._valuesPerDV[dv]);
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
  containsOneOf(range: RangePerDV): boolean {
    return (this._min <= range._min && range._min <= this._max)
        || (range._min <= this._min && this._min <= range._max);
  }

  /**
   * Get an array with all of the values.
   * @returns A sorted array with all the values.
   */
  getValuesArray(): number[] {
    let vs: number[] = [];

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      this._valuesPerDV[dv].getValuesArray().forEach(val => vs.push(val));

    vs.sort((a, b) => a - b);
    return vs;
  }

  /**
   * Returns a new range with the divided values.
   * @param d The divider.
   */
  divideBy(d: number): RangePerDV {
    let newRange = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      newRange.addValues(dv, this._valuesPerDV[dv].divideBy(d));

    return newRange;
  }

  /**
   * Returns a new range with the multiplied values.
   * @param m The multiplier.
   */
  multiplyBy(m: number): RangePerDV {
    let newRange = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      newRange.addValues(dv, this._valuesPerDV[dv].multiplyBy(m));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param a The adder.
   */
  add(a: number): RangePerDV {
    let newRange = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      newRange.addValues(dv, this._valuesPerDV[dv].add(a));

    return newRange;
  }

  /**
   * Returns a new range with the added values.
   * @param ra  The range adder.
   * @todo What is this used for?
   */
  addRange(ra: RangePerDV): RangePerDV {
    let newRange = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      newRange.addValues(dv, this._valuesPerDV[dv].addRange(ra._valuesPerDV[dv]));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param s The substracter.
   */
  substract(s: number): RangePerDV {
    let newRange = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      newRange.addValues(dv, this._valuesPerDV[dv].substract(s));

    return newRange;
  }

  /**
   * Returns a new range with the substracted values.
   * @param rs  The range substracter.
   * @todo What is this used for?
   */
  substractRange(rs: RangePerDV): RangePerDV {
    let newRange = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      newRange.addValues(dv, this._valuesPerDV[dv].substractRange(rs._valuesPerDV[dv]));

    return newRange;
  }

  toString(): string {
    let str = '';

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      if (dv in this._valuesPerDV)
        str += dv + ': ' + this._valuesPerDV[dv] + '<br />';
      else
        str += dv + ': -<br />';

    return str;
  }

  clone(): RangePerDV {
    let rangePerDV = new RangePerDV();

    for (let dv = 0; dv < RangePerDV.DVS; dv++)
      rangePerDV.addValues(dv, this._valuesPerDV[dv]);

    return rangePerDV;
  }
}

export { RangePerDV };
