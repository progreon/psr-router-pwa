import { EvolutionKey, Type, Item } from "../Model";
import { ExperienceGroup, Move } from "../ModelAbstract";
/**
 * Class representing an abstract pokemon
 * @todo
 * @todo jsdoc
 */
export abstract class Pokemon {
  public readonly key: string;
  public evolutions: { [key: string]: { evolutionKey: EvolutionKey, pokemon: Pokemon } };
  private _luMoves: { level: number, move: Move }[];
  private _tms: Item[]; // TODO: { tm: Item, move: Move } or { [key: string]: Move } ?
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
    this.key = name;
    this.evolutions = {};
    this._luMoves = [];
    this._tms = [];
  }
  /**
   * @param evolutionKey
   * @param pokemon
   * @todo
   */
  addEvolution(evolutionKey: EvolutionKey, pokemon: Pokemon) {
    this.evolutions[evolutionKey.toString().toUpperCase()] = { evolutionKey, pokemon };
  }
  getEvolution(evolutionKey: EvolutionKey): Pokemon {
    return this.evolutions[evolutionKey.toString().toUpperCase()]?.pokemon;
  }
  addLevelupMove(level: number, move: Move) {
    this._luMoves.push({ level, move });
  }
  addTm(tm: Item) {
    this._tms.push(tm);
  }

  get levelupMoves() { return this._luMoves; }
  get tms() { return this._tms; }

  getLearnedMoves(level: number): Move[] {
    return this._luMoves.filter(lm => lm.level == level).map(lm => lm.move);
  }
  getDefaultMoveset(level: number): Move[] {
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
