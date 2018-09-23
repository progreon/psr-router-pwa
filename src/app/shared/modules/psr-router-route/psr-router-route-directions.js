'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntry } from 'SharedModules/psr-router-route';

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
   * @param {Game}          game              The Game object this route entry uses.
   * @param {string}        description       A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   */
  constructor(game, description, location=undefined) {
    super(game, "", description, [], location);
  }

  static getEntryType() {
    return "";
  }
}

export { RouteDirections };
