'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntryInfo, RouteEntry } from 'SharedModules/psr-router-route';

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


  _getRouteFileLines(printerSettings) {
    var str = "\t";
    if (this.info.title !== "")
      str += this.info.title +  " :: ";
    str += this.info.summary;
    return [this.entryString, str];
  }

  static newFromRouteFileLines(game, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var entryString = lines[0].line;
      var line = "", title = "", summary = "";
      if (lines.length > 1) {
        var line = lines[1].line;
        summary = line;
        var i = line.indexOf(" :: ");
        if (i >= 0) {
          title = line.substring(0, i);
          summary = line.substring(i + 4);
        }
        if (lines.length > 2) {
          // TODO: throw exception
        }
      }
      var info = new RouteEntryInfo(title, summary);
      return new RouteBattle(game, entryString, info);
    } else {
      // TODO: throw exception
    }
  }
}

export { RouteBattle };
