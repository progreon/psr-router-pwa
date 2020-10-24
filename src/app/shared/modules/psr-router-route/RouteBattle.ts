'use strict';

// imports
import { RouterMessage, BadgeBoosts, Stages } from '../psr-router-util';
import { RouteEntryInfo } from './util';
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
import { Battler } from '../psr-router-model/ModelAbstract';
import { OpponentAction } from './psr-router-route-actions/OpponentAction';

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

  // public readonly playersBefore: Player[];
  public readonly battleStages: BattleStage[];

  // private entrants: { [key: number]: BattleEntrant[] } = {};

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
    // this.playersBefore = [];
    // trainer.party.forEach(b => this.playersBefore.push(undefined));
    this.battleStages = [];
  }

  public get entryType(): string {
    return RouteBattle.ENTRY_TYPE;
  }

  // public setEntrants(opponentIndex: number, entrants: BattleEntrant[]) {
  //   this.entrants[opponentIndex] = [];

  //   // check for doubles
  //   let partyIds: number[] = [];
  //   entrants.forEach(e => {
  //     if (!partyIds.includes(e.partyIndex)) {
  //       this.entrants[opponentIndex].push(e);
  //       partyIds.push(e.partyIndex);
  //     }
  //   });
  //   if (!partyIds.includes(0)) {
  //     this.entrants[opponentIndex].push(new BattleEntrant(0));
  //   }
  // }

  apply(player?: Player): Player {
    player = super.apply(player);

    // prepare the entrants object with defaults (not needed)
    // for (let i = 0; i < this.trainer.party.length; i++) {
    //   if (!this.entrants[i]) {
    //     this.setEntrants(i, [new BattleEntrant()]);
    //   }
    // }

    // TODO
    // 1 Initiate all BattleStages
    // 2 Collect all actions
    // 2.1 If OpponentAction & oppIndex < previous oppIndex, ignore & give warning
    // 3 Execute all actions

    // 1 Initiate all BattleStages
    this.battleStages.splice(0);
    // this.battleStages.push(new BattleStages(this, player, this.entrants[0]));
    this.battleStages.push(new BattleStage(this, player, 0));
    for (let ti = 1; ti < this.trainer.party.length; ti++) {
      // this.battleStages.push(BattleStages.newFromPreviousState(this.battleStages[ti - 1], this.entrants[1]));
      this.battleStages.push(BattleStage.newFromPreviousState(this.battleStages[ti - 1], ti));
    }

    // TODO
    // 2 collect all actions for each opponent (put these in BattleStages!)
    // let currentStage = this.battleStages[0];
    let currentOppIndex = 0;
    this.actions.forEach(action => {
      // TODO
      // 2.1 If OpponentAction & oppIndex < previous oppIndex, ignore & give warning
      if (action instanceof OpponentAction) {
        let oppAction = <OpponentAction>action;
        if (oppAction.oppIndex < currentOppIndex) {
          // TODO: ignore warning
        } else if (oppAction.oppIndex >= this.trainer.party.length) {
          // TODO: ignore warning
        } else {
          currentOppIndex = oppAction.oppIndex;
        }
      }
      this.battleStages[currentOppIndex].addAction(action);
    });

    // TODO: check
    // 3 Execute all actions
    this.battleStages[0].apply();
    for (let ti = 1; ti < this.trainer.party.length; ti++) {
      this.battleStages[ti].reset(this.battleStages[ti - 1]);
      this.battleStages[ti].apply();
    }

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
    
    // TODO: generalise this
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

  // public getActualBadgeBoosts(): BadgeBoosts {
  //   if (this.playerBefore) {
  //     // Only apply badge boosts when the player has the badge
  //     let atk = this.playerBefore.hasBadge("attack") ? 1 : 0;
  //     let def = this.playerBefore.hasBadge("defense") ? 1 : 0;
  //     let spd = this.playerBefore.hasBadge("speed") ? 1 : 0;
  //     let spc = this.playerBefore.hasBadge("special") ? 1 : 0;
  //     return new BadgeBoosts().setValues(atk, def, spd, spc);
  //   } else {
  //     return new BadgeBoosts();
  //   }
  // }

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

// TODO: to separate file? battle-utils or sth? circular imports?
export class BattleEntrant {
  constructor(
    public partyIndex: number = 0,
    public faint: boolean = false
  ) { }
}

export class BattleStage {
  public battle: RouteBattle;
  public player: Player;
  public nextPlayer: Player;

  public entrants: BattleEntrant[];
  private actions: AAction[] = [];

  public badgeBoosts: BadgeBoosts;
  public stages: Stages;
  // TODO: BadgeBoosts per battler? Might be overkill and not needed..

  private _currentPartyIndex: number;
  private readonly _opponentIndex: number;

  constructor(battle: RouteBattle, player: Player, opponentIndex: number) {
    this.battle = battle;
    this.player = player;
    this.nextPlayer = this.player.clone();
    this._opponentIndex = opponentIndex;
    this._pauseDamageCalc = true;

    this.setEntrants();
    this.reset();
  }

  public clearActions() {
    this.actions = [];
    this.updateDamages();
  }

  public addAction(action: AAction) {
    this.actions.push(action);
  }

  public apply() {
    // TODO
    this._pauseDamageCalc = true;
    this.actions.forEach(action => {
      action.applyAction(this.nextPlayer, this.battle); // TODO: pass "this"
    });
    this._pauseDamageCalc = false;
    this.updateDamages();
  }

  private getDefaultBadgeBoosts(): BadgeBoosts {
    let bb = new BadgeBoosts();
    if (this.player) {
      let atk = this.player.hasBadge("attack") ? 1 : 0;
      let def = this.player.hasBadge("defense") ? 1 : 0;
      let spd = this.player.hasBadge("speed") ? 1 : 0;
      let spc = this.player.hasBadge("special") ? 1 : 0;
      bb.setValues(atk, def, spd, spc);
    }
    return bb;
  }

  public swapBattler(partyIndex: number) {
    this._currentPartyIndex = partyIndex;
    this.badgeBoosts = this.getDefaultBadgeBoosts();
    this.stages = new Stages();
  }

  public getCompetingBattler(): Battler {
    return this.nextPlayer.team[this._currentPartyIndex];
  }

  public getOriginalBattler(partyIndex: number) {
    return this.player.team[partyIndex];
  }

  public setEntrants(entrants: BattleEntrant[] = []) {
    this.entrants = entrants;
    if (this.entrants.length == 0) {
      this.entrants.push(new BattleEntrant());
    } else {
      // check for doubles
      let partyIds: number[] = [];
      entrants.forEach(e => {
        if (!partyIds.includes(e.partyIndex)) {
          this.entrants.push(e);
          partyIds.push(e.partyIndex);
        }
      });
      if (!partyIds.includes(0)) {
        this.entrants.push(new BattleEntrant(0));
      }
    }
    this.updateDamages();
  }

  public reset(previousState?: BattleStage) {
    if (previousState) {
      this._currentPartyIndex = previousState._currentPartyIndex;
      if (this.battle.game.info.gen == 1 &&
        previousState.getOriginalBattler(this._currentPartyIndex).level == this.getOriginalBattler(this._currentPartyIndex).level) {
        this.badgeBoosts = previousState.badgeBoosts.clone();
      }
      this.stages = previousState.stages.clone();
    } else {
      this.swapBattler(0);
    }
    this.updateDamages();
  }

  static newFromPreviousState(previousState: BattleStage, opponentIndex: number): BattleStage {
    let newState = new BattleStage(previousState.battle, previousState.nextPlayer, opponentIndex);
    newState.reset(previousState);
    return newState;
  }

  //// DAMAGE CALCULATIONS ////
  private _pauseDamageCalc = true;
  private _damageRanges; // TODO: cache the damage ranges here
  public get damageRanges() { return this._damageRanges; }

  public updateDamages() {
    if (!this._pauseDamageCalc) {
      // TODO
    }
  }
}
