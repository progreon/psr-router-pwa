/**
 * Class representing a Pokemon type
 *
 * @class
 */
export default class Type {
  /**
   *
   * @param {string}   key         The key to use in maps
   * @param {string}   name        A more user friendly name
   * @param {boolean}  isPhysical  If moves of this type are physical in gen 1-3
   * @returns {Type}
   */
  constructor(key, name, isPhysical) {
    this.key = key;
    this.name = name;
    this.isPhysical = isPhysical;
  }

  toString() {
    return name;
  };
}
