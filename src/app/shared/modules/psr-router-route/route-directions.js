'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';

/**
 * A class representing a route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
class RouteDirections extends RouteEntry {
  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   */
  constructor(game, info=undefined, location=undefined) {
    super(game, info, location);
  }

  static getEntryType() {
    return "";
  }

  getJSONObject() {
    return super.getJSONObject();
  }

  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    var location = undefined; // TODO, parse from obj.location
    return new RouteDirections(game, info, location);
  }
}

export { RouteDirections };
