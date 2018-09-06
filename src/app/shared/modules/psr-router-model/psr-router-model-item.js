/**
 * Class representing an evolutionary stone
 *
 * @class
 */
export default class Item {
  /**
   *
   * @param {string}   key     The key to use in maps
   * @param {string}   name    A more user friendly name
   * @param {string}   usage   Defines how this item can be used ([TOI]*)
   * @param {number}   price   The price of this item
   * @param {string}   type    What type of item is this, optional
   * @param {string}   value   The "value" of this type of item (e.g. stone -> waterstone or tm -> toxic)
   * @returns {Item}
   */
  constructor(key, name, usage, price, type, value, description) {
    this.key = key;
    this.name = name;
    this.tossableOutsideBattle = usage.indexOf("T") !== -1;
    this.usableOutsideBattle = usage.indexOf("O") !== -1;
    this.usableInsideBattle = usage.indexOf("I") !== -1;
    this.price = price;
    this.type = type;
    this.value = value;
    this.description = description;
  }

  usage() {
    return (this.tossableOutsideBattle ? "T" : "") + (this.usableOutsideBattle ? "O" : "") + (this.usableInsideBattle ? "I" : "");
  };

  toString() {
    return this.name;
  };
}
