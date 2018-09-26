'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteSection } from 'SharedModules/psr-router-route';
import { saveAs } from 'file-saver/FileSaver';
import { GetEntryListFromLines } from '../psr-router-route-parser';

/**
 * A class representing the root route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteSection
 */
class Route extends RouteSection {
  /**
   *
   * @param {Game}          game              The Game object this route entry uses.
   * @param {string}        title             A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   */
  constructor(game, title, description="", location=undefined, children=[]) {
    super(game, title, description, location, children);
  }

  static getEntryType() {
    return "ROUTE";
  }

  exportToFile(filename) {
    // https://www.npmjs.com/package/file-saver
    if (!filename) {
      filename = super.toString() + ".txt";
    }
    var text = super.toRouteString();
    try {
      var isFileSaverSupported = !!new Blob;
      if (isFileSaverSupported) {
        var blob = new Blob(["Game: " + this.game.info.key, "\r\n\r\n", text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
      } else {
        window.alert("Exporting to a file is not supported for this browser...");
      }
    } catch (e) {
      window.alert("Exporting to a file is not supported for this browser...");
    }
  }

  /**
   * Create a new Route from lines in a route file.
   * @param {Game}        game    The parent route entry.
   * @param {string[]}    lines   The lines you would get with _getRouteFileLines
   * @returns {Route}
   * @todo Location
   * @todo Throw exception
   */
  static newFromRouteFileLines(game, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var line = lines[0].line;
      var title = line;
      var description = "";
      var i = line.indexOf(" :: ");
      if (i >= 0) {
        title = line.substring(0, i);
        description = line.substring(i + 4);
      }
      var route = new Route(game, title, description);
      var childEntries = GetEntryListFromLines(route, lines, 1);
      for (var ic = 0; ic < childEntries.length; ic++) {
        route._addEntry(childEntries[ic]);
      }
      return route;
    } else {
      // TODO: throw exception
    }
  }
}

export { Route };
