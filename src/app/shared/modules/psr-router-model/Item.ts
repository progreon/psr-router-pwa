/**
 * Class representing an item
 */
export class Item {
  public dummy = false; // TODO: TEMP
  public readonly tossableOutsideBattle: boolean;
  public readonly usableOutsideBattle: boolean;
  public readonly usableInsideBattle: boolean;
  /**
   *
   * @param name    A more user friendly name
   * @param key     The key to use in maps
   * @param usage   Defines how this item can be used ([TOI]*)
   * @param price   The price of this item
   * @param type    What type of item is this, optional
   * @param value   The "value" of this type of item (e.g. stone -> waterstone or tm -> toxic)
   */
  constructor( //
    public readonly key: string, //
    public readonly name: string, //
    usage: string, //
    public readonly price: number, //
    public readonly type: string, //
    public readonly value: string, //
    public readonly description: string //
  ) {
    this.tossableOutsideBattle = usage && usage.indexOf("T") !== -1;
    this.usableOutsideBattle = usage && usage.indexOf("O") !== -1;
    this.usableInsideBattle = usage && usage.indexOf("I") !== -1;
  }

  /**
   * Get the usage string of the item.
   */
  get usage(): string {
    return (this.tossableOutsideBattle ? "T" : "") + (this.usableOutsideBattle ? "O" : "") + (this.usableInsideBattle ? "I" : "");
  }

  isUsedOnPokemon(): boolean {
    return !!this.type;
  }

  equals(item: Item): boolean {
    return item && this.key === item.key;
  }

  toString(): string {
    return this.name;
  }
}
