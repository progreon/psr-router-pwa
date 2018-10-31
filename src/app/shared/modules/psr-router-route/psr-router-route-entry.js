'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntryInfo } from 'SharedModules/psr-router-route';
import { GetEntryLines } from './psr-router-route-parser';

/**
 * A class representing a route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
class RouteEntry {
  /**
   *
   * @param {Game}            game            The Game object this route entry uses.
   * @param {RouteEntryInfo}  [info=new]      The info for this entry.
   * @param {Location}        [location]      The location in the game where this entry occurs.
   * @param {RouteEntry[]}    [children=[]]   The child entries of this entry.
   */
  constructor(game, info=new RouteEntryInfo(), location=undefined, children=[]) {
    //// INPUT VARIABLES ////
    /** @type {Game} */
    this.game = game;
    /** @type {RouteEntryInfo} */
    this.info = info;
    /**
     * @type {Location}
     * @protected
     */
    this._location = location;
    /**
     * @type {RouteEntry[]}
     * @private
     */
    this._children = children;
    //// OTHERS ////
    /** @type {RouterMessage[]} */
    this.messages = [];
    /**
     * @type {Boolean}
     * @protected
     */
    this._eventsEnabled = false;
    /**
     * @type {Function[]}
     * @protected
     */
    this._observers = [];
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
  }

  /** @returns {string} */
  static getEntryType() {
    return "ENTRY";
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
   * @param {RouteEntry}  entry
   * @param {Function}    [observer]
   * @returns {RouteEntry} The added entry.
   * @protected
   * @todo refresh?
   */
  _addEntry(entry, observer) {
    this._children.push(entry);
    if (observer)
      entry.addObserver(observer);
    this._fireDataUpdated();
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
      this._fireDataUpdated();
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

  //// OBSERVER STUFF ////

  // for testing?
  triggerRefresh() {
    this.apply();
    this._firePlayerUpdated();
  }

  /**
   * Add a listener function to this entry.
   * Hint: .bind(this)
   *
   * @param {Function}  callback
   */
  addObserver(callback) {
    this._observers.push(callback);
  }

  /**
  * Notify listeners that the data is updated, to tell them to refresh the displayed data.
  * @protected
  * @todo Test!!!
  */
  _fireDataUpdated() {
    this._triggerObservers("data");
  }

  /**
   * Notify listeners that the player is updated, to retrigger the apply call.
   * @protected
   * @todo Test!!!
   */
  _firePlayerUpdated() {
    this._triggerObservers("player");
  }

  /**
   *
   * @param {String}  type
   * @protected
   * @todo Test!!!
   */
  _triggerObservers(type) {
    if (this._eventsEnabled) {
      var athis = this;
      this._observers.forEach(function(f) {
        f(athis, type);
      });
    }
  }

  //// STRINGS ////

  /** @returns {string} */
  toString() {
    return this.info.toString();
  }

  /**
   * Get the string to print to a route file. To edit the output, inherit _getRouteFileLines in subclasses.
   * @param {number}  [depth=0]   The depth in the route tree.
   * @param {PrinterSettings} [printerSettings] TODO
   * @returns {string}
   * @todo PrinterSettings
   * @todo Error/warning/info messages as comments.
   */
  toRouteString(depth=0, printerSettings) {
    var strings = this._getRouteFileLines(printerSettings);
    if (this.constructor.getEntryType() !== "")
      strings[0] = this.constructor.getEntryType() + ": " + strings[0];

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
   * Get the lines array to export to a route file. Inherit this method in subclasses. This should match with newFromRouteFileLines()!
   * @param {PrinterSettings} [printerSettings] TODO
   * @returns {string[]}
   * @protected
   * @todo PrinterSettings
   * @todo Location
   */
  _getRouteFileLines(printerSettings) {
    var str = this.info.title;
    if (this.info.summary !== "")
      str += " :: " + this.info.summary;
    var lines = [str];

    if (this.info.description) {
      var subLines = this.info.description.split("\n");
      subLines.forEach(line => {
        if (line.trim() !== "")
          lines.push("\t" + line.trim());
      });
    }

    return lines;
  }

  /**
   * Create a new RouteEntry from lines in a route file.
   * @param {RouteEntry}          parent  The parent route entry.
   * @param {{number, string}[]}  lines   The lines you would get with _getRouteFileLines
   * @returns {RouteEntry}
   * @todo Location: from parent
   * @todo Throw exception
   */
  static newFromRouteFileLines(parent, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var line = lines[0].line;
      var title = line;
      var summary = "";
      var i = line.indexOf(" :: ");
      if (i >= 0) {
        title = line.substring(0, i);
        summary = line.substring(i + 4);
      }
      var description = "";
      var entryLines = GetEntryLines(lines);
      for (var i = 1; i < entryLines.length; i++) {
        description += entryLines[i].line + "\n";
      }
      description.trim();
      var info = new RouteEntryInfo(title, summary, description);
      return new RouteEntry(parent.game, info, parent.getLocation());
    } else {
      // TODO: throw exception
    }
  }
}

export { RouteEntry };
