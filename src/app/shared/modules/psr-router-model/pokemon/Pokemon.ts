import { EvolutionKey, Type } from "../Model";
import { Move } from "../move/Move";
import { Game } from "../Game";
import { ExperienceGroup } from "../ModelAbstract";
/**
 * Class representing an abstract pokemon
 * @todo
 * @todo jsdoc
 */
export abstract class Pokemon {
  public readonly key: string;
  public evolutions: { [key: string]: Pokemon; };
  private _luMoves: { level: number, move: string }[];
  private _tmMoves: string[];
  constructor(
    public readonly name: string,
    public readonly id: number,
    public readonly type1: Type,
    public readonly type2: Type,
    public readonly expGiven: number,
    public readonly expGroup: ExperienceGroup,
    public readonly hp: number,
    public readonly atk: number,
    public readonly def: number,
    public readonly spcAtk: number,
    public readonly spcDef: number,
    public readonly spd: number) {
    this.key = name.toUpperCase();
    this.evolutions = {};
    this._luMoves = [];
    this._tmMoves = [];
  }
  /**
   * @param evolutionKey
   * @param pokemon
   * @todo
   */
  addEvolution(evolutionKey: EvolutionKey, pokemon: Pokemon) {
    this.evolutions[evolutionKey.toString()] = pokemon;
  }
  getEvolution(evolutionKey: EvolutionKey): Pokemon {
    return this.evolutions[evolutionKey.toString()];
  }
  addLevelupMove(level: number, move: string) {
    this._luMoves.push({ level, move });
  }
  addTmMove(tm: string) {
    this._tmMoves.push(tm);
  }

  get levelupMoves() { return this._luMoves; }
  get tmMoves() { return this._tmMoves; }

  getLearnedMoves(level: number): string[] {
    return this._luMoves.filter(lm => lm.level == level).map(lm => lm.move);
  }
  getDefaultMoveset(level: number): string[] {
    let moveset = [];
    this._luMoves.forEach(lm => {
      if (lm.level <= level && !moveset.includes(lm.move)) {
        moveset.push(lm.move);
      }
    });
    return moveset.slice(-4);
  }
  abstract getExp(level: number, participants: number, isTraded: boolean, isTrainer: boolean): number;
  abstract getCritRatio(): number;
  abstract getHighCritRatio(): number;
  compare(pokemon: Pokemon): number {
    return this.name.localeCompare(pokemon.name);
  }
  toString(): string {
    return this.name;
  }
}
