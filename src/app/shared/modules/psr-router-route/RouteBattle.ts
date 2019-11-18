'use strict';

// imports
import { RouterMessage, BadgeBoosts } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import { Game } from '../psr-router-model/Game';
import { Trainer, Location, Player } from '../psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';

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

  public readonly playersBefore: Player[];
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
    this.playersBefore = [];
    trainer.party.forEach(b => this.playersBefore.push(undefined));
  }

  public get entryType(): string {
    return RouteBattle.ENTRY_TYPE;
  }

  apply(player?: Player): Player {
    player = super.apply(player);
    // prepare the shareExp array
    let shareExp = this.shareExp;
    if (!shareExp) {
      shareExp = [];
      this.trainer.party.forEach(p => shareExp.push([0]));
    }

    this.playersBefore.splice(0);
    for (let p = 0; p < this.trainer.party.length; p++) {
      this.playersBefore.push(player);
      player = player.clone();

      let sharedCount = shareExp[p].length;
      shareExp[p].forEach(sh => {
        if (sh >= player.team.length) {
          this.addMessage(new RouterMessage(`The player doesn't have ${sh + 1} pokemon to share experience with!`, RouterMessage.Type.Error));
        } else {
          // Only evolve at the end of the battle
          let evoBattler = player.team[sh].defeatBattler(this.trainer.party[p], sharedCount);
          if (p + 1 == this.trainer.party.length) {
            player.team[sh] = evoBattler;
          }
        }
      });
    }
    switch (this.trainer.name.toUpperCase()) {
      case "BROCK":
        player.addBadge("attack");
        break;
      case "SURGE":
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
    if (this.shareExp) {
      obj.properties.shareExp = this.shareExp;
    }
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
    let shareExp = obj.properties.shareExp;
    let location = undefined; // TODO, parse from obj.location
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let entry = new RouteBattle(game, trainer, info, location, shareExp);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
