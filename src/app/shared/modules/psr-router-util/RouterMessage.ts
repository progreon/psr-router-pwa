export class RouterMessage {
  constructor(
    public message: string,
    public type: RouterMessage.Type
  ) {}

  toString(): string {
    return RouterMessage.Type[this.type] + ": " + this.message;
  }
}

/* istanbul ignore next */
export namespace RouterMessage {
  export enum Type {
    Error, Warning, Info, Debug
  }
}
