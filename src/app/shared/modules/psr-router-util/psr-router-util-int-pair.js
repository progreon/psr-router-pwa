/**
 * Class representing a number pair
 */
class IntPair {
  /**
   *
   * @param {number} int1
   * @param {number} int2
   */
  constructor(int1, int2) {
    /** @type {number} */
    this.int1 = parseInt(int1);
    /** @type {number} */
    this.int2 = parseInt(int2);
  }

  /**
   * Set the values
   * @param {number} int1
   * @param {number} int2
   */
  setValues(int1, int2) {
    this.int1 = parseInt(int1);
    this.int2 = parseInt(int2);
  }

  /** @returns {string} */
  toString() {
    return '<' + this.int1 + ';' + this.int2 + '>';
  }
}

export default IntPair;
