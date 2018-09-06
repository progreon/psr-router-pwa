/**
 * Class representing a number pair
 *
 * @class
 */
export default class IntPair {
  /**
   *
   * @param {number} int1
   * @param {number} int2
   * @returns {IntPair}
   */
  constructor(int1, int2) {
    this.int1 = parseInt(int1);
    this.int2 = parseInt(int2);
  }

  /**
   *
   * @param {number} int1
   * @param {number} int2
   * @returns {undefined}
   */
  setValues(int1, int2) {
    this.int1 = parseInt(int1);
    this.int2 = parseInt(int2);
  }

  /**
   *
   * @returns {String}
   */
  toString() {
    return '<' + this.int1 + ';' + this.int2 + '>';
  }
}
