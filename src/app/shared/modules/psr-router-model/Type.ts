/**
 * Class representing a Pokemon type.
 */
export class Type {
  public dummy = false; // TODO: TEMP
  /**
   *
   * @param key         The key to use in maps
   * @param name        A more user friendly name
   * @param isPhysical  If moves of this type are physical in gen 1-3
   */
  constructor( //
    public readonly key: string, //
    public readonly name: string, //
    public readonly isPhysical = true //
  ) { }

  toString(): string {
    return this.name;
  }
}
