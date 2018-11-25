'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';

/**
 * A class representing a route-entry that handles battles.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
class RouteBattle extends RouteEntry {
  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {string}          entryString       TEMP
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   */
  constructor(game, entryString, info=undefined, location=undefined) {
    super(game, info, location);
    this.entryString = entryString;
  }

  static getEntryType() {
    return "B";
  }

  getJSONObject() {
    var obj = super.getJSONObject();
    obj.entryString = this.entryString;
    return obj;
  }

  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    var location = undefined; // TODO, parse from obj.location
    return new RouteBattle(game, obj.entryString, info, location);
  }
}

export { RouteBattle };
