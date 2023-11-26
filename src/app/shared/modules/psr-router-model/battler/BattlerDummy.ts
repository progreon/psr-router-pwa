import { Game, Item } from "../Model";
import { Battler } from "../ModelAbstract";
import { PokemonDummy } from "../ModelDummy";

import { DVRange } from "../../psr-router-util";
import { Range } from "../../psr-router-util";
import { EvolutionKey } from "../EvolutionKey";

/**
 * Class representing a dummy battler
 */
export class BattlerDummy extends Battler {
  constructor(game: Game, pokemon: PokemonDummy, catchLocation: any, isTrainerMon: boolean, level: number) {
    super(game, pokemon, catchLocation, isTrainerMon, level);
  }

  defeatBattler(battler: Battler, participants: number): Battler { throw new Error("Method not implemented."); }
  evolve(key: EvolutionKey): Battler { throw new Error("Method not implemented."); }
  addXP(exp: number): Battler { throw new Error("Method not implemented."); }
  useHPUp(count: number): boolean { throw new Error("Method not implemented."); }
  useProtein(count: number): boolean { throw new Error("Method not implemented."); }
  useIron(count: number): boolean { throw new Error("Method not implemented."); }
  useCarbos(count: number): boolean { throw new Error("Method not implemented."); }
  useCalcium(count: number): boolean { throw new Error("Method not implemented."); }
  getDVRange(stat: number): DVRange { throw new Error("Method not implemented."); }
  getDVRanges(): DVRange[] { throw new Error("Method not implemented."); }

  get hp(): Range { throw new Error("Method not implemented."); }
  get atk(): Range { throw new Error("Method not implemented."); }
  get def(): Range { throw new Error("Method not implemented."); }
  get spcAtk(): Range { throw new Error("Method not implemented."); }
  get spcDef(): Range { throw new Error("Method not implemented."); }
  get spd(): Range { throw new Error("Method not implemented."); }
  get spc(): Range { throw new Error("Method not implemented."); }

  get hpXP(): number { throw new Error("Method not implemented."); }
  get atkXP(): number { throw new Error("Method not implemented."); }
  get defXP(): number { throw new Error("Method not implemented."); }
  get spcAtkXP(): number { throw new Error("Method not implemented."); }
  get spcDefXP(): number { throw new Error("Method not implemented."); }
  get spdXP(): number { throw new Error("Method not implemented."); }
  get spcXP(): number { throw new Error("Method not implemented."); }

  getStatExp(): number[] { return []; }
  getBoostedStat(statRange: Range, badgeBoostCount: number, xItemCount: number): Range { throw new Error("Method not implemented."); }
  equals(battler: Battler): boolean { throw new Error("Method not implemented."); }
  clone(): Battler { throw new Error("Method not implemented."); }
}
