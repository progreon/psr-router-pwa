/**
 * Class representing a Pokemon type.
 */
class Type {
  /**
   *
   * @param {string}   key         The key to use in maps
   * @param {string}   name        A more user friendly name
   * @param {boolean}  isPhysical  If moves of this type are physical in gen 1-3
   */
  constructor(key, name, isPhysical) {
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.name = name;
    /** @type {boolean} */
    this.isPhysical = isPhysical;
  }

  /** @returns {string} */
  toString() {
    return this.name;
  }
}

export { Type };
