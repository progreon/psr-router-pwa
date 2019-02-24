/**
 * An enumeration of router message types: { name:string, priority:number }
 * @enum {{string, number}}
 */
const RouterMessageType = { // type => priority
  ERROR: { name: "Error", priority: 0},
  WARNING: { name: "Warning", priority: 1},
  INFO: { name: "Info", priority: 2},
  DEBUG: { name: "Debug", priority: 3}
}

/**
 * A class for displaying messages in the front end.
 * @todo everything
 * @todo types
 */
class RouterMessage {
  /**
   *
   * @param message A description for this entry.
   * @param type    The type of route entry.
   */
  constructor(
    public message: string,
    public type = RouterMessageType.ERROR
    ) {}

  toString(): string {
    return this.type.name + ": " + this.message;
  }
}

export { RouterMessage, RouterMessageType }

enum RouterMessageT {
  Error, Warning, Info, Debug
}

class RouterM {
  constructor(
    public message: string,
    public type: RouterMessageT
  ) {}

  toString(): string {
    return RouterMessageT[this.type] + ": " + this.message;
  }
}
