'use strict';

// imports
import { RouterMessage, BadgeBoosts, Stages, Range } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Trainer, Location, Player } from '../psr-router-model/Model';
import { Battler, Move } from '../psr-router-model/ModelAbstract';
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
import { OpponentAction } from './psr-router-route-actions/OpponentAction';

const possibleActions: { [key: string]: (obj: ActionJSON, game: Game) => AAction } = {};
possibleActions[UseAction.ACTION_TYPE.toUpperCase()] = UseAction.newFromJSONObject;
possibleActions[SwapAction.ACTION_TYPE.toUpperCase()] = SwapAction.newFromJSONObject;
possibleActions[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = SwapPokemonAction.newFromJSONObject;
possibleActions[TmAction.ACTION_TYPE.toUpperCase()] = TmAction.newFromJSONObject;
possibleActions[TossAction.ACTION_TYPE.toUpperCase()] = TossAction.newFromJSONObject;
possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()] = DirectionAction.newFromJSONObject;
possibleActions[OpponentAction.ACTION_TYPE.toUpperCase()] = OpponentAction.newFromJSONObject;
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

  public readonly battleStages: BattleStage[];

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
    this.battleStages = [];
  }

  public get entryType(): string {
    return RouteBattle.ENTRY_TYPE;
  }

  apply(player?: Player): Player {
    player = super.apply(player);

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

    // 2 collect all actions for each opponent (put these in BattleStages!)
    // let currentStage = this.battleStages[0];
    let currentOppIndex = 0;
    this.actions.forEach(action => {
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

    // 3 Execute all actions
    this.battleStages[0].apply();
    this.battleStages[0].messages.forEach(m => this.addMessage(m));
    for (let ti = 1; ti < this.trainer.party.length; ti++) {
      this.battleStages[ti].reset(this.battleStages[ti - 1]);
      this.battleStages[ti].apply();
      this.battleStages[ti].messages.forEach(m => this.addMessage(m));
    }
    this._playerAfter = this.battleStages[this.battleStages.length - 1].nextPlayer;

    // TODO: generalise this
    switch (this.trainer.name.toUpperCase()) {
      case "BROCK":
        this._playerAfter.addBadge("attack");
        break;
      case "LTSURGE":
        this._playerAfter.addBadge("defense");
        break;
      case "KOGA":
        this._playerAfter.addBadge("speed");
        break;
      case "BLAINE":
        this._playerAfter.addBadge("special");
        break;
    }
    return this._playerAfter;
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

  private _badgeBoosts: BadgeBoosts;
  public get badgeBoosts() { return this._badgeBoosts; }
  public set badgeBoosts(value) { this._badgeBoosts = value; this.updateDamages(); }
  private _stages: Stages;
  public get stages() { return this._stages; }
  public set stages(value) { this._stages = value; this.updateDamages(); }
  private _stagesOpponent: Stages;
  public get stagesOpponent() { return this._stagesOpponent; }
  public set stagesOpponent(value) { this._stagesOpponent = value; this.updateDamages(); }
  // TODO: BadgeBoosts per battler? Might be overkill and not needed..

  public readonly opponentIndex: number;
  private _currentPartyIndex: number;
  public get currentPartyIndex() { return this._currentPartyIndex; }

  constructor(battle: RouteBattle, player: Player, opponentIndex: number) {
    this.battle = battle;
    this.player = player;
    this.opponentIndex = opponentIndex;
    this._currentPartyIndex = 0;
    this._pauseDamageCalc = true;

    this.setEntrants();
    this.reset();
  }

  public get messages() { return this.actions.map(a => a.messages).reduce((prev, curr) => prev.concat(curr), []); }

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
      action.applyAction(this.nextPlayer, this);
    });
    // Get all the exp
    this.entrants.forEach(entrant => {
      if (!entrant.faint) {
        if (entrant.partyIndex >= this.nextPlayer.team.length) {
          this.battle.addMessage(new RouterMessage(`The player doesn't have ${entrant.partyIndex + 1} pokemon to share experience with!`, RouterMessage.Type.Error));
        } else {
          // Only evolve at the end of the battle
          let evoBattler = this.nextPlayer.team[entrant.partyIndex].defeatBattler(this.battle.trainer.party[this.opponentIndex], this.entrants.filter(e => !e.faint).length);
          if (this.opponentIndex + 1 == this.battle.trainer.party.length) {
            this.nextPlayer.team[entrant.partyIndex] = evoBattler;
          }
        }
      }
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

  public swapBattler(partyIndex: number, letItDie: boolean = false) {
    this._currentPartyIndex = partyIndex;
    this.badgeBoosts = this.getDefaultBadgeBoosts();
    this.stages = new Stages();

    // Check if it's in the entrants list
    let isInEntrants = false;
    this.entrants.forEach(e => {
      if (e.partyIndex == partyIndex) {
        isInEntrants = true;
      }
    });
    if (!isInEntrants) {
      // TODO: warning or adding it by itself?
      // this.addMessage(new RouterMessage(`${player.team[this.partyIndex1]} is not in the entrants list`, RouterMessage.Type.Warning));
      console.log(`${this.player.team[partyIndex]} is not in the entrants list, adding it...`);
      this.entrants.push(new BattleEntrant(partyIndex, letItDie));
    }
  }

  public getCompetingBattler(): Battler {
    return this.nextPlayer.team[this._currentPartyIndex];
  }

  public getOriginalBattler(partyIndex: number) {
    return this.player.team[partyIndex];
  }

  public getTrainerBattler() {
    return this.battle.trainer.party[this.opponentIndex];
  }

  public setEntrants(entrants: BattleEntrant[] = []) {
    this.entrants = [];
    if (entrants.length == 0) {
      this.entrants.push(new BattleEntrant(this._currentPartyIndex));
    } else {
      // check for doubles
      let partyIds: number[] = [];
      entrants.forEach(e => {
        if (!partyIds.includes(e.partyIndex)) {
          // TODO: do it like this or keep the latest? Give warning?
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

  public useBattleItem(value: string) {
    let curS = this._stages;
    switch (value) {
      case "X_ATTACK":
        this._stages.setStages(curS.atk + 1, curS.def, curS.spd, curS.spc);
        if (this.battle.game.info.gen == 1) {
          // Apply badge boosts again
          let curBB = this._badgeBoosts;
          let defBB = this.getDefaultBadgeBoosts();
          this._badgeBoosts.setValues(defBB.atk, curBB.def + defBB.def, curBB.spd + defBB.spd, curBB.spc + defBB.spc);
        }
        break;
      case "X_DEFEND":
        this._stages.setStages(curS.atk, curS.def + 1, curS.spd, curS.spc);
        if (this.battle.game.info.gen == 1) {
          // Apply badge boosts again
          let curBB = this._badgeBoosts;
          let defBB = this.getDefaultBadgeBoosts();
          this._badgeBoosts.setValues(curBB.atk + defBB.atk, defBB.def, curBB.spd + defBB.spd, curBB.spc + defBB.spc);
        }
        break;
      case "X_SPEED":
        this._stages.setStages(curS.atk, curS.def, curS.spd + 1, curS.spc);
        if (this.battle.game.info.gen == 1) {
          // Apply badge boosts again
          let curBB = this._badgeBoosts;
          let defBB = this.getDefaultBadgeBoosts();
          this._badgeBoosts.setValues(curBB.atk + defBB.atk, curBB.def + defBB.def, defBB.spd, curBB.spc + defBB.spc);
        }
        break;
      case "X_SPECIAL":
        this._stages.setStages(curS.atk, curS.def, curS.spd, curS.spc + 1);
        if (this.battle.game.info.gen == 1) {
          // Apply badge boosts again
          let curBB = this._badgeBoosts;
          let defBB = this.getDefaultBadgeBoosts();
          this._badgeBoosts.setValues(curBB.atk + defBB.atk, curBB.def + defBB.def, curBB.spd + defBB.spd, defBB.spc);
        }
        break;
    }
  }

  public reset(previousState?: BattleStage) {
    if (previousState) {
      this.player = previousState.nextPlayer;
      this._currentPartyIndex = previousState._currentPartyIndex;
      this.setEntrants();
      if (this.battle.game.info.gen == 1 &&
        previousState.getOriginalBattler(this._currentPartyIndex).level == this.getOriginalBattler(this._currentPartyIndex).level) {
        this.badgeBoosts = previousState.badgeBoosts.clone();
      }
      this.stages = previousState.stages.clone();
    } else {
      this.swapBattler(0);
    }
    this.nextPlayer = this.player.clone();
    this._stagesOpponent = new Stages();
    this.updateDamages();
  }

  static newFromPreviousState(previousState: BattleStage, opponentIndex: number): BattleStage {
    let newState = new BattleStage(previousState.battle, previousState.nextPlayer, opponentIndex);
    newState.reset(previousState);
    return newState;
  }

  //// DAMAGE CALCULATIONS ////
  private _pauseDamageCalc = true;
  public readonly damageRanges: {
    entrant: BattleEntrant,
    playerDR: { move: Move, range: Range, critRange: Range }[],
    trainerDR: { move: Move, range: Range, critRange: Range }[]
  }[] = [];

  public updateDamages() {
    if (!this._pauseDamageCalc) {
      this.damageRanges.splice(0);
      this.entrants.forEach(entrant => {
        if (entrant.partyIndex < this.player.team.length) {
          let b = this.player.team[entrant.partyIndex];
          let ob = this.battle.trainer.party[this.opponentIndex];
          let damageRange: {
            entrant: BattleEntrant,
            playerDR: { move: Move, range: Range, critRange: Range }[],
            trainerDR: { move: Move, range: Range, critRange: Range }[]
          } = { entrant, playerDR: [], trainerDR: [] };
          this.player.team[entrant.partyIndex].moveset.forEach(move => {
            let m = this.battle.game.findMoveByName(move);
            let dr = this.battle.game.engine.getDamageRange(this.battle.game, move, b, ob, this.stages, this.stagesOpponent, this.badgeBoosts, new BadgeBoosts());
            damageRange.playerDR.push({ move: m, range: dr.range, critRange: dr.critRange });
          });
          this.battle.trainer.party[this.opponentIndex].moveset.forEach(move => {
            let m = this.battle.game.findMoveByName(move);
            let dr = this.battle.game.engine.getDamageRange(this.battle.game, move, ob, b, this.stagesOpponent, this.stages, new BadgeBoosts(), this.badgeBoosts);
            damageRange.trainerDR.push({ move: m, range: dr.range, critRange: dr.critRange });
          });
          this.damageRanges.push(damageRange);
        }
      });
    }
  }
}
