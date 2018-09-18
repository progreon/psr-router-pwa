/**
 * An enumeration of router message types: { name:string, priority:number }
 * @enum {{string, number}}
 */
const RouterMessageType = { // type => priority
  ERROR: { name: "Error", priority: 0},
  WARNING: { name: "Warning", priority: 1},
  HINT: { name: "Hint", priority: 2},
  INFO: { name: "Info", priority: 3}
}

/**
 * A class for displaying messages in the front end.
 * @todo everything
 * @todo types
 */
class RouterMessage {
  /**
   *
   * @param {string}  message                                     A description for this entry.
   * @param {RouterMessageType}  [type=RouterMessageType.ERROR]   The type of route entry.
   */
  constructor(message, type=RouterMessageType.ERROR) {
    /** @type {string} */
    this.message = message;
    /** @type {string} */
    this.type = type;
  }

  /** @returns {string} */
  toString() {
    return this.type + ": " + this.message;
  }
}

export { RouterMessage, RouterMessageType }
