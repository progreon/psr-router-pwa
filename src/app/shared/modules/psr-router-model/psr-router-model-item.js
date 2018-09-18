/**
 * Class representing an evolutionary stone
 */
class Item {
  /**
   *
   * @param {string}   key     The key to use in maps
   * @param {string}   name    A more user friendly name
   * @param {string}   usage   Defines how this item can be used ([TOI]*)
   * @param {number}   price   The price of this item
   * @param {string}   type    What type of item is this, optional
   * @param {string}   value   The "value" of this type of item (e.g. stone -> waterstone or tm -> toxic)
   */
  constructor(key, name, usage, price, type, value, description) {
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.name = name;
    /** @type {boolean} */
    this.tossableOutsideBattle = usage.indexOf("T") !== -1;
    /** @type {boolean} */
    this.usableOutsideBattle = usage.indexOf("O") !== -1;
    /** @type {boolean} */
    this.usableInsideBattle = usage.indexOf("I") !== -1;
    /** @type {number} */
    this.price = price;
    /** @type {string} */
    this.type = type;
    /** @type {string} */
    this.value = value;
    /** @type {string} */
    this.description = description;
  }

  /**
   * Get the usage string of the item.
   * @returns {string} The usage string.
   */
  usage() {
    return (this.tossableOutsideBattle ? "T" : "") + (this.usableOutsideBattle ? "O" : "") + (this.usableInsideBattle ? "I" : "");
  }

  /**
   * @param {Item}
   * @returns {boolean}
   */
  equals(item) {
    return item && this.key === item.key;
  }

  /** @returns {string} */
  toString() {
    return this.name;
  }
}

export { Item };
