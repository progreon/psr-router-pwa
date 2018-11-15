'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntryInfo, RouteEntry } from 'SharedModules/psr-router-route';
import { GetEntryLines } from './psr-router-route-parser';

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
    var lines = [this.entryString, str];

    if (this.info.description) {
      var subLines = this.info.description.split("\n");
      subLines.forEach(line => {
        if (line.trim() !== "")
          lines.push("\t" + line.trim());
      });
    }

    return lines;
  }

  static newFromRouteFileLines(game, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var entryString = lines[0].line;
      var line = "", title = "", summary = "", description = "";
      var entryLines = GetEntryLines(lines);
      if (entryLines.length > 1) {
        var line = entryLines[1].line;
        summary = line;
        var i = line.indexOf(" :: ");
        if (i >= 0) {
          title = line.substring(0, i);
          summary = line.substring(i + 4);
        }
      }
      for (var i = 2; i < entryLines.length; i++) {
        description += entryLines[i].line + "\n";
      }
      description.trim();
      var info = new RouteEntryInfo(title, summary, description);
      return new RouteBattle(game, entryString, info);
    } else {
      // TODO: throw exception
    }
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
