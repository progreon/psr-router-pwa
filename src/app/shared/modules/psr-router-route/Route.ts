'use strict';

// imports
import { GetGame } from '../psr-router-game-factory';
import { RouterError, RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteSection } from '.';
import { Game } from '../psr-router-model/Game';
import { Player } from '../psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';
import { RouteJSON } from './parse/RouteJSON';

/**
 * A class representing the root route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteSection
 */
export class Route {
  public static readonly ENTRY_TYPE: string = "Route";
  public static instance: Route;

  public readonly game: Game;
  public shortname: string;
  public readonly rootSection: RouteSection;
  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {RouteEntryInfo}  info              The info for this entry.
   * @param {String}          [shortname]       A shortname for this route, also the file name.
   * @param {RouteEntry[]}    [children=[]]     The child entries of this entry.
   * @todo +otherSettings
   */
  constructor(game: Game, rootSection: RouteSection, shortname?: string) {
    this.game = game;
    this.rootSection = rootSection;
    this.shortname = shortname ? shortname : rootSection.info.title;
  }

  public get entryType(): string {
    return Route.ENTRY_TYPE;
  }

  public get info(): RouteEntryInfo {
    return this.rootSection.info;
  }

  getAllMessages(): RouterMessage[] {
    let messages = [];
    this.rootSection.entryList.forEach(e => e.messages.forEach(m => messages.push(m)));
    return messages;
  }

  apply(): void {
    this.rootSection.apply(new Player(this.game.info.name));
  }

  getJSONObject(): EntryJSON {
    let routeSectionJSON = this.rootSection.getJSONObject();
    return new RouteJSON(this.rootSection.game.info.key, this.shortname, routeSectionJSON.info, routeSectionJSON.entries);
  }

  static newFromJSONObject(obj: RouteJSON): Route {
    if (!obj) {
      // TODO: throw exception?
    } else if (!obj.game) {
      throw new RouterError("Unable to find game from json", "Route.newFromJSONObject Error");
    }
    let game = GetGame(obj.game);
    if (!game) {
      throw new RouterError(`Unable to find game '${obj.game}'`, "Route.newFromJSONObject Error");
    }
    let rs = RouteSection.newFromJSONObject(obj, game);
    let route = new Route(game, rs, obj.shortname); // TODO: rs.info
    return route;
  }
}
