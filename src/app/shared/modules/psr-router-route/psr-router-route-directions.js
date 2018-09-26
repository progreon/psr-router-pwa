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

  _getRouteFileLines(printerSettings) {
    return [this.description];
  }

  static newFromRouteFileLines(parent, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      return new RouteDirections(parent.game, lines[0].line, parent.getLocation());
    } else {
      // TODO: throw exception
    }
  }
}

export { RouteDirections };
