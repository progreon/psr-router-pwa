'use strict';

// imports
import { GetGame } from '../psr-router-game-factory';
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteSection } from '.';
import { Game } from '../psr-router-model/Game';
import { Location, Player } from '../psr-router-model/Model';
import { RouteEntry } from './RouteEntry';
import { EntryJSON } from './parse/EntryJSON';
import { RouteJSON } from './parse/RouteJSON';
// import { saveAs } from 'file-saver/FileSaver';

/**
 * A class representing the root route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteSection
 */
export class Route extends RouteSection {
  public static readonly ENTRY_TYPE: string = "Route";
  public shortname: string;
  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {RouteEntryInfo}  info              The info for this entry.
   * @param {String}          [shortname]       A shortname for this route, also the file name.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}    [children=[]]     The child entries of this entry.
   * @todo -extends, +rootSection, +game, +otherSettings
   */
  constructor(game: Game, info: RouteEntryInfo, shortname?: string, location?: Location, children: RouteEntry[] = []) {
    super(game, info, location, children);
    this.shortname = shortname ? shortname : info.title;
  }

  public get entryType(): string {
    return Route.ENTRY_TYPE;
  }

  getAllMessages(): RouterMessage[] {
    let messages = [];
    this.entryList.forEach(e => e.messages.forEach(m => messages.push(m)));
    return messages;
  }

  getJSONObject(): EntryJSON {
    let routeSectionJSON = super.getJSONObject();
    return new RouteJSON(this.game.info.key, this.shortname, routeSectionJSON.info, routeSectionJSON.entries);
  }

  static newFromJSONObject(obj: RouteJSON): Route {
    if (!obj) {
      // TODO: throw exception?
    } else if (!obj.game) {
      // TODO: throw exception?
    }
    let game = GetGame(obj.game);
    if (!game) {
      // TODO: throw exception?
    }
    let rs = RouteSection.newFromJSONObject(obj, game);
    let player = new Player(game.info.name);
    let route = new Route(rs.game, new RouteEntryInfo(rs.info.title, rs.info.summary), obj.shortname, rs.location, rs.children); // TODO: rs.info
    route._playerBefore = player;
    return route;
  }
}
