/**
 * Class representing a trainer
 */
class Trainer {
  /**
   *
   * @param {string}      key           The key to use in maps
   * @param {string}      name          The (generated) name
   * @param {string}      trainerClass  The trainer class
   * @param {Battler[]}   party         The party
   * @param {string}      location      The name of the location the trainer is at // TODO: Location instead of string?
   * @param {string}      [alias]       An alias given to the trainer
   */
  constructor(key, name, trainerClass, party, location, alias=undefined) {
    /** @type {string} */
    this.key = key;
    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.trainerClass = trainerClass;
    /** @type {Battler[]} */
    this.party = party;
    /** @type {string} */
    this.location = location;
    /** @type {string} */
    this.alias = alias;
  }

  /** @returns {string} */
  toString() {
    return (this.alias ? this.alias : this.key);
  }
}

export { Trainer };
