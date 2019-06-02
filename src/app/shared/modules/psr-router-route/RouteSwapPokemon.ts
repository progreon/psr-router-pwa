'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';
// import * as Model1 from 'SharedModules/psr-router-model/Model1';

/**
 * A class representing a route-entry that gets you a pokemon out of a list of possible pokemon.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteSwapPokemon extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "Swap";
  /**
   *
   * @param game      The Game object this route entry uses
   * @param index1    Index 1
   * @param index2    Index 2
   * @param box1      Box index 1
   * @param box2      Box index 2
   * @param info      The info for this entry
   * @param location  The location in the game where this entry occurs
   */
  constructor(game: Model.Game,
              public readonly index1: number,
              public readonly index2: number,
              public readonly box1: number,
              public readonly box2: number,
              info: RouteEntryInfo = null,
              location: Model.Location = null) {
    super(game, info, location);
  }

  public get entryType(): string {
    return RouteSwapPokemon.ENTRY_TYPE;
  }

  apply(player?: Model.Player): Model.Player {
    player = super.apply(player);

    if (this.index1 >= 0 && this.index1 < player.team.length && this.index2 >= 0 && this.index2 < player.team.length) {
      player.swapBattlers(this.index1, this.index2);
    } else {
      super.addMessage(new RouterMessage("Invalid party indices (ignoring)", RouterMessage.Type.Error));
    }

    return player;
  }

  getJSONObject(): any {
    let obj = super.getJSONObject();
    obj.swaps = { index1: this.index1, index2: this.index2 };
    return obj;
  }

  static newFromJSONObject(game: Model.Game, obj: any): RouteSwapPokemon {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location

    let index1 = obj.swaps.index1;
    let index2 = obj.swaps.index2;
    if (index1 < 0 || index2 < 0) {
      messages.push(new RouterMessage("Wrong indices", RouterMessage.Type.Error));
    }

    let entry = new RouteSwapPokemon(game, index1, index2, -1, -1, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
