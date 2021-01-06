/**
 * Class representing static route entry info.
 */
export class RouteEntryInfo {
  /**
   *
   * @param title A fitting title
   * @param summary A short description
   * @param description A longer description
   */
  constructor(
    public title = "",
    public summary = "",
    public description = ""
  ) { }

  toString(): string {
    let str = this.title;
    if (this.title !== "" && this.summary !== "")
      str += ": ";
    return str + this.summary;
  }
}
