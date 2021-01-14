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
import { SwapMoveAction } from './psr-router-route-actions/SwapMoveAction';
import { SwapPokemonAction } from './psr-router-route-actions/SwapPokemonAction';
import { DirectionAction } from './psr-router-route-actions/DirectionAction';
import { BSettingsAction } from './psr-router-route-actions/BSettingsAction';
import { OpponentAction } from './psr-router-route-actions/OpponentAction';
import { Route } from './Route';

const possibleActions: { [key: string]: (obj: ActionJSON, game: Game) => AAction } = {};
possibleActions[UseAction.ACTION_TYPE.toUpperCase()] = UseAction.newFromJSONObject;
possibleActions[SwapAction.ACTION_TYPE.toUpperCase()] = SwapAction.newFromJSONObject;
possibleActions[SwapMoveAction.ACTION_TYPE.toUpperCase()] = SwapMoveAction.newFromJSONObject;
possibleActions[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = SwapPokemonAction.newFromJSONObject;
possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()] = DirectionAction.newFromJSONObject;
possibleActions[OpponentAction.ACTION_TYPE.toUpperCase()] = OpponentAction.newFromJSONObject;
possibleActions[BSettingsAction.ACTION_TYPE.toUpperCase()] = BSettingsAction.newFromJSONObject;
const defaultAction: (obj: ActionJSON, game: Game) => AAction = possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()];

/**
 * A class representing a route-entry that handles battles.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteBattle extends ARouteActionsEntry {
  public static readonly POSSIBLE_ACTIONS = possibleActions;
  public static readonly DEFAULT_ACTION = defaultAction;

  public static readonly ENTRY_TYPE: string = "B";
  public readonly trainer: Trainer;

  public readonly battleStages: RouteBattle.Stage[];

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

  public get opponentParty(): Battler[] {
    return this.trainer.party;
  }

  apply(player?: Player, fireApplied = true): void {
    super.apply(player, false);
    let nextPlayer = super.nextPlayer;

    if (this.trainer?.dummy) {
      this.addMessage(new RouterMessage(`Trainer "${this.trainer.key}" not found`, RouterMessage.Type.Error));
    }

    // Steps:
    // 1 Initiate all BattleStages
    // 2 Collect all actions
    // 2.1 If OpponentAction & oppIndex < previous oppIndex, ignore & give warning
    // 3 Execute all actions

    // 1 Initiate all BattleStages
    this.battleStages.splice(0);
    // this.battleStages.push(new BattleStages(this, player, this.entrants[0]));
    this.battleStages.push(new RouteBattle.Stage(this, nextPlayer, 0));
    for (let ti = 1; ti < this.opponentParty.length; ti++) {
      // this.battleStages.push(BattleStages.newFromPreviousState(this.battleStages[ti - 1], this.entrants[1]));
      this.battleStages.push(RouteBattle.Stage.newFromPreviousState(this.battleStages[ti - 1], ti));
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
        } else if (oppAction.oppIndex >= this.opponentParty.length) {
          // TODO: ignore warning
        } else {
          currentOppIndex = oppAction.oppIndex;
        }
      }
      this.battleStages[currentOppIndex].addAction(action);
    });

    // 3 Execute all actions
    for (let ti = 0; ti < this.opponentParty.length; ti++) {
      if (ti > 0) {
        this.battleStages[ti].reset(this.battleStages[ti - 1]);
      }
      this.battleStages[ti].apply();
      this.battleStages[ti].messages.forEach(m => this.addMessage(m));
    }
    nextPlayer = this.battleStages[this.battleStages.length - 1].nextPlayer;
    if (!this.trainer) {
      console.debug(this);
    }
    if (this.trainer?.items) {
      this.trainer.items.forEach(i => {
        let added = nextPlayer.addItem(i);
        if (!added) {
          this.addMessage(new RouterMessage(`You don't have room for this item! (${i.toString()})`, RouterMessage.Type.Info));
        }
      });
    }

    if (this.trainer) {
      // Collect the prize money
      nextPlayer.addMoney(this.trainer.money);

      // Add badge boosts
      if (this.trainer.badgeboost) {
        nextPlayer.addBadge(this.trainer.badgeboost);
      }
    }


    super.updateNextPlayer(nextPlayer, fireApplied);
  }

  getJSONObject(): EntryJSON {
    let obj: EntryJSON = super.getJSONObject();
    if (this.trainer) {
      obj.properties.trainer = this.trainer.alias || this.trainer.key;
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
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location

    let entry = new RouteBattle(game, trainer, info, location);
    entry.setActionsFromJSONObject(obj, possibleActions, defaultAction, game);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}

// TODO: to separate file? battle-utils or sth? circular imports?
export namespace RouteBattle {
  export class Entrant {
    constructor(
      public partyIndex: number = 0,
      public faint: boolean = false
    ) { }
  }

  export class Stage {
    public battle: RouteBattle;
    public player: Player;
    public nextPlayer: Player;

    public entrants: Entrant[];
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
            let evoBattler = this.nextPlayer.team[entrant.partyIndex].defeatBattler(this.battle.opponentParty[this.opponentIndex], this.entrants.filter(e => !e.faint).length);
            if (this.opponentIndex + 1 == this.battle.opponentParty.length) {
              this.nextPlayer.team[entrant.partyIndex] = evoBattler;
            }
          }
        }
      });
      this.enableDamageCalc();
    }

    private getDefaultBadgeBoosts(): BadgeBoosts {
      let bb = new BadgeBoosts();
      if (this.player) {
        bb.setBoosts(this.player.badges);
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
        console.debug(`${this.player.team[partyIndex]} is not in the entrants list, adding it...`);
        this.entrants.push(new Entrant(partyIndex, letItDie));
      }
    }

    public getCompetingBattler(): Battler {
      return this.nextPlayer.team[this._currentPartyIndex];
    }

    public getOriginalBattler(partyIndex: number) {
      return this.player.team[partyIndex];
    }

    public getTrainerBattler() {
      return this.battle.opponentParty[this.opponentIndex];
    }

    public setEntrants(entrants: Entrant[] = []) {
      this.entrants = [];
      if (entrants.length == 0) {
        this.entrants.push(new Entrant(this._currentPartyIndex));
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
          this.entrants.push(new Entrant(0));
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
            this._badgeBoosts.gen1ApplyAllAndReset("atk");
          }
          break;
        case "X_DEFEND":
          this._stages.setStages(curS.atk, curS.def + 1, curS.spd, curS.spc);
          if (this.battle.game.info.gen == 1) {
            // Apply badge boosts again
            this._badgeBoosts.gen1ApplyAllAndReset("def");
          }
          break;
        case "X_SPEED":
          this._stages.setStages(curS.atk, curS.def, curS.spd + 1, curS.spc);
          if (this.battle.game.info.gen == 1) {
            // Apply badge boosts again
            this._badgeBoosts.gen1ApplyAllAndReset("spd");
          }
          break;
        case "X_SPECIAL":
          this._stages.setStages(curS.atk, curS.def, curS.spd, curS.spc + 1);
          if (this.battle.game.info.gen == 1) {
            // Apply badge boosts again
            this._badgeBoosts.gen1ApplyAllAndReset("spc");
          }
          break;
      }
    }

    public reset(previousState?: Stage) {
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

    static newFromPreviousState(previousState: Stage, opponentIndex: number): Stage {
      let newState = new Stage(previousState.battle, previousState.nextPlayer, opponentIndex);
      newState.reset(previousState);
      return newState;
    }

    //// DAMAGE CALCULATIONS ////
    private _pauseDamageCalc = true;
    public readonly damageRanges: {
      entrant: Entrant,
      playerDR: { move: Move, range: Range, critRange: Range, killRanges: number[] }[],
      trainerDR: { move: Move, range: Range, critRange: Range }[]
    }[] = [];

    public disableDamageCalc() {
      this._pauseDamageCalc = true;
      this.damageRanges.splice(0);
    }
    
    public enableDamageCalc() {
      this._pauseDamageCalc = false;
      this.updateDamages();
    }

    public updateDamages() {
      if (!this._pauseDamageCalc) {
        this.damageRanges.splice(0);
        this.entrants.forEach(entrant => {
          if (entrant.partyIndex < this.player.team.length) {
            let b = this.player.team[entrant.partyIndex];
            let ob = this.battle.opponentParty[this.opponentIndex];
            let damageRange: {
              entrant: Entrant,
              playerDR: { move: Move, range: Range, critRange: Range, killRanges: number[] }[],
              trainerDR: { move: Move, range: Range, critRange: Range }[]
            } = { entrant, playerDR: [], trainerDR: [] };
            this.player.team[entrant.partyIndex].moveset.map(ms => ms.move).forEach(move => {
              let dr = this.battle.game.engine.getDamageRange(this.battle.game, move, b, ob, this.stages, this.stagesOpponent, this.badgeBoosts, new BadgeBoosts());

              // Calculate the kill range for 1-3 times, not accounting for accuracy
              // TODO: can this be more performant?
              let krs = []; // kill ranges
              if (dr.range.count > 0) {
                let cp = move.highCritMove ? this.player.team[entrant.partyIndex].pokemon.getHighCritRatio() : this.player.team[entrant.partyIndex].pokemon.getCritRatio(); // crit%
                let drTimes = { range: dr.range.clone(), critRange: dr.critRange.clone() };
                let times = 1;
                let certainDeath = false;
                while (times <= 3 && !certainDeath) {
                  let killCount = 0, killTotal = drTimes.range.count * ob.hp.count;
                  Object.keys(drTimes.range.valueMap).forEach(d => {
                    Object.keys(ob.hp.valueMap).filter(hp => +d >= +hp).forEach(hp => killCount += drTimes.range.valueMap[d] * ob.hp.valueMap[hp]);
                  });
                  let ckillCount = 0, ckillTotal = drTimes.critRange.count * ob.hp.count;
                  Object.keys(drTimes.critRange.valueMap).forEach(d => {
                    Object.keys(ob.hp.valueMap).filter(hp => +d >= +hp).forEach(hp => ckillCount += drTimes.critRange.valueMap[d] * ob.hp.valueMap[hp]);
                  });
                  let kr = (killCount / killTotal) * (1 - cp) + (ckillCount / ckillTotal) * cp;
                  krs.push(kr);
                  certainDeath = kr == 1;
                  drTimes = { range: drTimes.range.addRange(dr.range), critRange: drTimes.critRange.addRange(dr.critRange) };
                  times++;
                }
              }
              damageRange.playerDR.push({ move, range: dr.range, critRange: dr.critRange, killRanges: krs });
            });
            this.battle.opponentParty[this.opponentIndex].moveset.map(ms => ms.move).forEach(move => {
              let dr = this.battle.game.engine.getDamageRange(this.battle.game, move, ob, b, this.stagesOpponent, this.stages, new BadgeBoosts(), this.badgeBoosts);
              damageRange.trainerDR.push({ move, range: dr.range, critRange: dr.critRange });
            });
            this.damageRanges.push(damageRange);
          }
        });
      }
    }
  }
}
