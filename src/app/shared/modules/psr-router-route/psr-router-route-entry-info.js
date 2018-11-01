/**
 * Class representing static route entry info.
 */
class RouteEntryInfo {
  /**
   *
   * @param {String}    [title=""]
   * @param {String}    [summary=""]
   * @param {String}    [description=""]
   * @param {String[]}  [images=[]]
   */
  constructor(title="", summary="", description="") {
    /** @type {String} */
    this.title = title;
    /** @type {String} */
    this.summary = summary;
    /** @type {String} */
    this.description = description;
  }

  /** @returns {string} */
  toString() {
    var str = this.title;
    if (this.title !== "" && this.summary !== "")
      str += ": ";
    return str + this.summary;
  }
}

export { RouteEntryInfo };
