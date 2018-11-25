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
   * @param {String}          [shortname]       A shortname for this route, also the file name.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}    [children=[]]     The child entries of this entry.
   * @todo -extends, +rootSection, +game, +otherSettings
   */
  constructor(game, info, shortname=undefined, location=undefined, children=[]) {
    super(game, info, location, children);
    this.shortname = shortname ? shortname : info.title;
  }

  static getEntryType() {
    return "Route";
  }

  getJSONObject() {
    var routeSectionJSON = super.getJSONObject();
    var routeJSON = {
      game: this.game.info.key,
      shortname: this.shortname,
      info: routeSectionJSON.info,
      entries: routeSectionJSON.entries
    };
    return routeJSON;
  }

  static newFromJSONObject(obj) {
    console.log("newFromJSONObject", obj);
    if (!obj) {
      // TODO: throw exception?
    } else if (!obj.game) {
      // TODO: throw exception?
    }
    var game = GetGame(obj.game);
    if (!game) {
      // TODO: throw exception?
    }
    var rs = RouteSection.newFromJSONObject(game, obj);
    return new Route(rs.game, new RouteEntryInfo(rs.info.title, rs.info.summary), obj.shortname, rs._location, rs._children); // TODO: rs.info
  }
}

export { Route };
