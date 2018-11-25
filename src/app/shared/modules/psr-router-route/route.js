'use strict';

// imports
import { GetGame } from '../psr-router-data';
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteSection } from '.';
// import { saveAs } from 'file-saver/FileSaver';

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
   * @param {Game}            game              The Game object this route entry uses.
   * @param {RouteEntryInfo}  title             The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}    [children=[]]     The child entries of this entry.
   * @todo -extends, +rootSection, +game, +otherSettings
   */
  constructor(game, info, location=undefined, children=[]) {
    super(game, info, location, children);
  }

  static getEntryType() {
    return "Route";
  }

  getJSONObject() {
    // return super.getJSONObject();
    var routeSectionJSON = super.getJSONObject();
    var routeJSON = { game: this.game.info.key, info: routeSectionJSON.info, entries: routeSectionJSON.entries };
    return routeJSON;
  }

  static newFromJSONObject(obj) {
    if (!obj) {
      // TODO: throw exception?
    } else if (!obj.game) {
      // TODO: throw exception?
    }
    var game = GetGame(obj.game);
    if (!game) {
      // TODO: throw exception?
    }
    var rs = RouteSection.newFromJSONObject(game, obj); // TODO: -obj, +obj.root
    return new Route(rs.game, new RouteEntryInfo(rs.info.title, rs.info.summary), rs._location, rs._children); // TODO: rs.info
  }
}

export { Route };
