// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';

/**
 * A class representing a route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
class RouteEntry {
  /**
   *
   * @param {Game}          game              The Game object this route entry uses.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @param {string}        [type="ENTRY"]    The type of route entry.
   */
  constructor(game, title="", description="", location=undefined, children=[], type="ENTRY") {
    //// INPUT VARIABLES ////
    /** @type {Game} */
    this.game = game;
    /** @type {string} */
    this.title = title;
    /** @type {string} */
    this.description = description;
    /**
     * @type {RouteEntry[]}
     * @protected
     */
    this._location = location;
    /**
     * @type {string}
     * @private
     */
    this._children = children;
    /**
     * @type {Location}
     * @protected
     */
    this._type = type;
    //// OTHERS ////
    /**
     * @type {Player}
     * @protected
     */
    this._playerBefore = undefined;
    /**
     * @type {Player}
     * @protected
     */
    this._playerAfter = undefined;
    /** @type {RouterMessage[]} */
    this.messages = [];
  }

  /** @returns {string} */
  getEntryType() {
    return this._type;
  }

  /**
   * Notify listeners that the data is updated, to tell them to refresh the displayed data.
   * @protected
   * @todo Test!!!
   */
  _notifyListeners() {
    this.dispatchEvent(new CustomEvent('entry-updated', {detail: {entry: this}}));
  }

  /**
   * Apply this entry to the player (which holds the state of the game).
   * @param {Player} [player] The player before this entry. If undefined, just recalculate.
   * @returns {Player} Returns the player after this entry (if you edit this instance, getPlayerAfter() will be edited too).
   */
  apply(player) {
    var newPlayer;
    this.messages = [];
    if (player)
      this._playerBefore = player;

    if (this._playerBefore) {
      newPlayer = this._playerBefore.clone();
      // TODO: this.wildEncounters.apply(newPlayer); // Defeat wild encounters
    } else {
      this.messages.push(new RouterMessage("There is no player set!", RouterMessageType.ERROR));
    }

    this._playerAfter = newPlayer;
    return newPlayer;
  }

  /**
   * Get only the direct children.
   * @returns {RouteEntry[]} The list of direct children.
   */
  getChildren() {
    return this._children;
  }

  /**
   * Gets all of its entries, including itself as the first one.
   * @returns {RouteEntry[]} The entry list.
   */
  getEntryList() {
    var entryList = [this];

    if (this._children)
      this._children.forEach(c => {entryList.push(...c.getEntryList())})

    return entryList;
  }

  /**
   * Add a child entry.
   * @param {RouteEntry} entry
   * @returns {RouteEntry} The added entry.
   * @protected
   */
  _addEntry(entry) {
    this._children.push(entry);
    // this._notifyListeners();
    return entry;
  }

  /** @returns {Location} */
  getLocation() {
    return this._location;
  }

  /** @param {Location} location */
  setLocation(location) {
    if (this._location != location) {
      this._location = location;
      //TODO: this.wildEncounters.reset();
      this._notifyListeners();
    }
  }

  /**
   * Gets the player when entering this entry. Be aware this might still be undefined.
   * @returns {Player}
   */
  getPlayerBefore() {
    return this._playerBefore;
  }

  /**
   * Gets the player when exiting this entry. Be aware this might still be undefined.
   * @returns {Player}
   */
  getPlayerAfter() {
    return this._playerAfter;
  }

  /**
   * Gets the most important message type that this entry has.
   * @returns {RouterMessageType} The current message type with the highest priority.
   */
  getMessageType() {
    var type = RouterMessageType.INFO;
    this.messages.forEach(m => {if (m.type.priority < type.priority) type = m.type});
    return type;
  }

  /** @returns {string} */
  toString() {
    var str = this.title;
    if (this.title !== "" && this.description !== "")
      str += ": ";
    return str + this.description;
  }

  /**
   * Get the string to print to a route file. To edit the output, inherit _getRouteFileLines in subclasses.
   * @param {number}  [depth=0]   The depth in the route tree.
   * @param {PrinterSettings} [printerSettings] TODO
   * @returns {string}
   * @todo PrinterSettings
   */
  toRouteString(depth=0, printerSettings) {
    var strings = this._getRouteFileLines(printerSettings);
    var tabs = "";
    for (var t = 0; t < depth; t++) {
      tabs += "\t";
    }
    var str = "";
    for (var s = 0; s < strings.length; s++) {
      str += tabs + strings[s] + "\r\n";
    }
    for (var c = 0; c < this._children.length; c++) {
      str += this._children[c].toRouteString(depth + 1, printerSettings);
    }
    return str;
  }

  /**
   * Get the lines array to export to a route file. Inherit this method in subclasses.
   * @param {PrinterSettings} [printerSettings] TODO
   * @returns {string[]}
   * @todo PrinterSettings
   */
  _getRouteFileLines(printerSettings) {
    var str = this.title;
    if (this.title !== "" && this.description !== "")
      str += " :: ";
    str += this.description;
    return [str];
  }
}

export { RouteEntry };
