'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';

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
   */
  constructor(game, info=new RouteEntryInfo(), location=undefined) {
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
   * Gets all of its entries, including itself as the first one.
   * @returns {RouteEntry[]} The entry list.
   */
  getEntryList() {
    return [this];
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
   * @todo doc
   * @todo lcoation
   */
  getJSONObject() {
    // { type, info: {title, summary, description}, location, data } // data = specific entry data
    var type = this.constructor.getEntryType();
    var info = { title: this.info.title, summary: this.info.summary, description: this.info.description };
    var location = ""; // TODO, parse from this._location;
    var obj = { type, info, location };
    return obj;
  }

  /**
   * @todo doc
   */
  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    var location = undefined; // TODO, parse from obj.location
    return new RouteEntry(game, info, location);
  }
}

export { RouteEntry };
