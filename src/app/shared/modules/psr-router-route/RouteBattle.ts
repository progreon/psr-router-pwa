'use strict';

// imports
import { RouterMessage, BadgeBoosts } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import { Game } from '../psr-router-model/Game';
import { Trainer, Location, Player } from '../psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';
import { ActionJSON } from './parse/actions/ActionJSON';

import { ARouteActionsEntry } from './ARouteActionsEntry';

import { AAction } from './psr-router-route-actions/AAction';
import { UseAction } from './psr-router-route-actions/UseAction';
import { SwapAction } from './psr-router-route-actions/SwapAction';
import { SwapPokemonAction } from './psr-router-route-actions/SwapPokemonAction';
import { TmAction } from './psr-router-route-actions/TmAction';
import { TossAction } from './psr-router-route-actions/TossAction';
import { DirectionAction } from './psr-router-route-actions/DirectionAction';
import { BSettingsAction } from './psr-router-route-actions/BSettingsAction';

const possibleActions: { [key: string]: (obj: ActionJSON, game: Game) => AAction } = {};
possibleActions[UseAction.ACTION_TYPE.toUpperCase()] = UseAction.newFromJSONObject;
possibleActions[SwapAction.ACTION_TYPE.toUpperCase()] = SwapAction.newFromJSONObject;
possibleActions[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = SwapPokemonAction.newFromJSONObject;
possibleActions[TmAction.ACTION_TYPE.toUpperCase()] = TmAction.newFromJSONObject;
possibleActions[TossAction.ACTION_TYPE.toUpperCase()] = TossAction.newFromJSONObject;
possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()] = DirectionAction.newFromJSONObject;
possibleActions[BSettingsAction.ACTION_TYPE.toUpperCase()] = BSettingsAction.newFromJSONObject;

/**
 * A class representing a route-entry that handles battles.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteBattle extends ARouteActionsEntry {
  public static readonly ENTRY_TYPE: string = "B";
  public readonly trainer: Trainer;

  public readonly playersBefore: Player[];

  private entrants: { [key: number]: { partyIndex: number, faint?: boolean }[] } = {};

  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {Trainer}         trainer           The trainer to battle against.
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   */
  constructor(game: Game, trainer: Trainer, info: RouteEntryInfo = null, location: Location = null) {
    super(game, info, location);
    this.trainer = trainer;
    this.playersBefore = [];
    trainer.party.forEach(b => this.playersBefore.push(undefined));
  }

  public get entryType(): string {
    return RouteBattle.ENTRY_TYPE;
  }

  public setEntrants(opponentIndex: number, entrants: { partyIndex: number, faint?: boolean }[]) {
    this.entrants[opponentIndex] = entrants;
  }

  apply(player?: Player): Player {
    player = super.apply(player);

    // prepare the entrants object with defaults
    this.entrants = {};
    for (let i = 0; i < this.trainer.party.length; i++) {
      this.setEntrants(i, [{ partyIndex: 0 }]);
    }

    // TODO


    // this.playersBefore.splice(0);
    // for (let p = 0; p < this.trainer.party.length; p++) {
    //   this.playersBefore.push(player);
    //   player = player.clone();

    //   if (shareExp[p] == undefined) shareExp[p] = [];
    //   let sharedCount = shareExp[p].length;
    //   shareExp[p].forEach(sh => {
    //     if (sh >= player.team.length) {
    //       this.addMessage(new RouterMessage(`The player doesn't have ${sh + 1} pokemon to share experience with!`, RouterMessage.Type.Error));
    //     } else {
    //       // Only evolve at the end of the battle
    //       let evoBattler = player.team[sh].defeatBattler(this.trainer.party[p], sharedCount);
    //       if (p + 1 == this.trainer.party.length) {
    //         player.team[sh] = evoBattler;
    //       }
    //     }
    //   });
    // }
    switch (this.trainer.name.toUpperCase()) {
      case "BROCK":
        player.addBadge("attack");
        break;
      case "LTSURGE":
        player.addBadge("defense");
        break;
      case "KOGA":
        player.addBadge("speed");
        break;
      case "BLAINE":
        player.addBadge("special");
        break;
    }
    this._playerAfter = player;
    return player;
  }

  public getActualBadgeBoosts(): BadgeBoosts {
    if (this.playerBefore) {
      // Only apply badge boosts when the player has the badge
      let atk = this.playerBefore.hasBadge("attack") ? 1 : 0;
      let def = this.playerBefore.hasBadge("defense") ? 1 : 0;
      let spd = this.playerBefore.hasBadge("speed") ? 1 : 0;
      let spc = this.playerBefore.hasBadge("special") ? 1 : 0;
      return new BadgeBoosts().setValues(atk, def, spd, spc);
    } else {
      return new BadgeBoosts();
    }
  }

  getJSONObject(): EntryJSON {
    let obj: EntryJSON = super.getJSONObject();
    obj.properties.trainer = this.trainer.alias || this.trainer.key;
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Game): RouteBattle {
    let messages: RouterMessage[] = [];
    let trainer = game.findTrainerByKeyOrAlias(obj.properties.trainer);
    if (!trainer) {
      trainer = game.getDummyTrainer(obj.properties.trainer);
      if (!game.info.unsupported) {
        messages.push(new RouterMessage(`Trainer "${obj.properties.trainer}" not found!`, RouterMessage.Type.Error));
      }
    }
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location

    let entry = new RouteBattle(game, trainer, info, location);
    entry.setActionsFromJSONObject(obj, possibleActions, game);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
