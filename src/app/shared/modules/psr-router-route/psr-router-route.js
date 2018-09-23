'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteSection } from 'SharedModules/psr-router-route';
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
        console.log(this.game.info.name);
        var blob = new Blob(["Game: " + this.game.info.name, "\r\n\r\n", text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
      } else {
        window.alert("Exporting to a file is not supported for this browser...");
      }
    } catch (e) {
      window.alert("Exporting to a file is not supported for this browser...");
    }
  }
}

export { Route };
