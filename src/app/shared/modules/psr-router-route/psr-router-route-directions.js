'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntryInfo, RouteEntry } from 'SharedModules/psr-router-route';
import { GetEntryLines } from './psr-router-route-parser';

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

  _getRouteFileLines(printerSettings) {
    var lines = [this.info.summary];

    if (this.info.description) {
      var subLines = this.info.description.split("\n");
      subLines.forEach(line => {
        if (line.trim() !== "")
          lines.push("\t" + line.trim());
      });
    }

    return lines;
  }

  static newFromRouteFileLines(parent, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var summary = lines[0].line;
      var description = "";
      var entryLines = GetEntryLines(lines);
      for (var i = 1; i < entryLines.length; i++) {
        description += entryLines[i].line + "\n";
      }
      description.trim();
      return new RouteDirections(parent.game, new RouteEntryInfo("", summary, description), parent.getLocation());
    } else {
      // TODO: throw exception
    }
  }

  getJSONObject() {
    return super.getJSONObject();
  }

  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    return new RouteDirections(game, info, obj.location);
  }
}

export { RouteDirections };
