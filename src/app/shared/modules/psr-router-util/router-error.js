/**
 * A class for displaying messages in the front end.
 * @todo everything
 * @todo types
 */
class RouterError extends Error {
  /**
   *
   * @param {string}  message                 A description for this entry.
   * @param {string}  [type="Router Error"]   The type of route entry.
   */
  constructor(message, type="Router Error") {
    super(type + ": " + message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(type + ": " + message)).stack;
    }
  }
}

export { RouterError };
