'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import { Game } from '../psr-router-model/Game';
import { Trainer, Location } from '../psr-router-model/Model';

/**
 * A class representing a route-entry that handles battles.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteBattle extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "B";
  public readonly trainer: Trainer;
  public readonly shareExp: number[][];
  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {Trainer}         trainer           The trainer to battle against.
   * @param {Array}           [shareExp]        Which pokemon in the player's party to share exp with.
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   */
  constructor(game: Game, trainer: Trainer, info: RouteEntryInfo = null, location: Location = null, shareExp: number[][] = null) {
    super(game, info, location);
    this.trainer = trainer;
    this.shareExp = shareExp;
  }

  public get entryType(): string {
    return RouteBattle.ENTRY_TYPE;
  }

  getJSONObject(): any {
    let obj = super.getJSONObject();
    obj.trainer = this.trainer.alias || this.trainer.key;
    if (this.shareExp) {
      obj.shareExp = this.shareExp;
    }
    return obj;
  }

  static newFromJSONObject(game: Game, obj: any): RouteBattle {
    let messages: RouterMessage[] = [];
    let trainer = game.findTrainerByKeyOrAlias(obj.trainer);
    if (!trainer) {
      trainer = game.getDummyTrainer(obj.trainer);
      if (!game.info.unsupported) {
        messages.push(new RouterMessage(`Trainer "${obj.trainer}" not found!`, RouterMessage.Type.Error));
      }
    }
    let shareExp = obj.shareExp;
    let location = undefined; // TODO, parse from obj.location
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let entry = new RouteBattle(game, trainer, info, location, shareExp);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
