'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import { Game } from '../psr-router-model/Game';
import { Location } from '../psr-router-model/Model';

/**
 * A class representing a route-entry.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteDirections extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "";
  /**
   *
   * @param game      The Game object this route entry uses.
   * @param info      The info for this entry.
   * @param location  The location in the game where this entry occurs.
   */
  constructor(game: Game, info: RouteEntryInfo = null, location: Location = null) {
    super(game, info, location);
  }

  public get entryType(): string {
    return RouteDirections.ENTRY_TYPE;
  }

  getJSONObject(): any {
    return super.getJSONObject();
  }

  static newFromJSONObject(game: Game, obj: any): RouteDirections {
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location: Location = null; // TODO, parse from obj.location
    return new RouteDirections(game, info, location);
  }
}
