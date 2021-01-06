/**
 * Class representing game information.
 */
export class GameInfo {
  /**
   *
   * @param key          The key to use in maps
   * @param name         A more user friendly name
   * @param gen          The generation this game is made for
   * @param year         The year this game was released in
   * @param platform     The platform for which this game is made
   * @param unsupported  If this game isn't supported yet here
   */
  constructor(
    public readonly key: string,
    public readonly name = key,
    public readonly gen = 0,
    public readonly year = 0,
    public readonly platform = "???",
    public readonly unsupported = true
  ) { }
}
