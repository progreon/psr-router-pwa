/**
 * A class for displaying messages in the front end.
 * @todo everything
 * @todo types
 */
class RouterError extends Error {
  /**
   *
   * @param message The error message
   * @param type    The error type
   */
  constructor(message: string, type = "Router Error") {
    super(message);
    super.name = type;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { RouterError };
