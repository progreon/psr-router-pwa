'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntry } from 'SharedModules/psr-router-route';

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
   * @param {Game}        game              The Game object this route entry uses.
   * @param {string}      entryString       TEMP
   * @param {string}      [title=""]        A title for this entry.
   * @param {string}      [description=""]  A description for this entry.
   * @param {Location}    [location]        The location in the game where this entry occurs.
   */
  constructor(game, entryString, title="", description="", location=undefined) {
    super(game, title, description, location);
    this.entryString = entryString;
  }

  static getEntryType() {
    return "B";
  }


  _getRouteFileLines(printerSettings) {
    var str = "";
    if (this.title !== "")
      str += this.title +  " :: ";
    str += this.description;
    return [this.entryString, str];
  }

  static newFromRouteFileLines(game, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var entryString = lines[0].line;
      var line = "", title = "", description = "";
      if (lines.length > 1) {
        var line = lines[1].line;
        description = line;
        var i = line.indexOf(" :: ");
        if (i >= 0) {
          title = line.substring(0, i);
          description = line.substring(i + 4);
        }
        if (lines.length > 2) {
          // TODO: throw exception
        }
      }
      return new RouteBattle(game, entryString, title, description);
    } else {
      // TODO: throw exception
    }
  }
}

export { RouteBattle };
