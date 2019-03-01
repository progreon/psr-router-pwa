/**
 * Class representing an evolutionary stone.
 */
export class Stone {
  /**
   *
   * @param {number}   id      The unique ID of this stone
   * @param {string}   key     The key to use in maps
   * @param {string}   name    A more user friendly name
   * @param {number}   gen     The generation it was introduced in
   */
  constructor( //
    public readonly id: number, //
    public readonly key: string, //
    public readonly name: string, //
    public readonly gen: number //
  ) { }
}
