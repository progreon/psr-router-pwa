'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo, RouteParser } from './util';
import { RouteSection } from '.';
import { saveAs } from 'file-saver/FileSaver';

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
   * @param {string}        [summary=""]      A summary for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @todo -extends, +rootSection, +game, +otherSettings
   */
  constructor(game, title, summary="", location=undefined, children=[]) {
    super(game, new RouteEntryInfo(title, summary), location, children);
  }

  static getEntryType() {
    return "Route";
  }

  exportToFile(filename, printerSettings) {
    console.log(filename, printerSettings);
    // https://www.npmjs.com/package/file-saver
    var ext = printerSettings && printerSettings.toJSON ? ".json" : ".txt";
    filename = (filename ? filename : super.toString()) + ext;
    var text = printerSettings && printerSettings.toJSON ? this.getJSONString(printerSettings) : this.toRouteString();
    try {
      var isFileSaverSupported = !!new Blob;
      if (isFileSaverSupported) {
        var blob = new Blob(["Game: " + this.game.info.key, "\r\n\r\n", text], {type: "text/plain;charset=utf-8"});
        console.log(text);
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
      var summary = "";
      var i = line.indexOf(" :: ");
      if (i >= 0) {
        title = line.substring(0, i);
        summary = line.substring(i + 4);
      }
      var route = new Route(game, title, summary);
      var childEntries = RouteParser.GetEntryListFromLines(route, lines, 1);
      for (var ic = 0; ic < childEntries.length; ic++) {
        route._addEntry(childEntries[ic]);
      }
      return route;
    } else {
      // TODO: throw exception
    }
  }

  getJSONString(printerSettings) {
    // TODO: handle printerSettings
    if (printerSettings && printerSettings.printEmptyProperties) {
      return JSON.stringify(this.getJSONObject(), null, "\t");
    } else {
      return JSON.stringify(this.getJSONObject(), (key, val) => (val && (val !== [] || val !== {})) || val === false ? val : undefined, "\t");
    }
  }

  getJSONObject() {
    return super.getJSONObject();
  }

  static newFromJSONObject(game, obj) {
    var rs = super.newFromJSONObject(game, obj); // TODO: -obj, +obj.root
    return new Route(rs.game, rs.info.title, rs.info.summary, rs._location, rs._children); // TODO: rs.info
  }
}

export { Route };
