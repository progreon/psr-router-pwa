import { Pokemon } from "./pokemon/Pokemon";
import { PokemonLevelPair } from "./PokemonLevelPair";

/**
 * Class representing pokemon-count pair.
 */
export class PokemonCountPair {
  /**
   *
   * @param {Pokemon} pokemon
   * @param {number} level
   * @param {number} count
   */
  constructor( //
    public readonly pokemon: Pokemon, //
    public readonly level: number, //
    public count: number //
  ) { }

  // inc() {
  //   this.count++;
  // }

  // dec() {
  //   if (this.count > 0)
  //     this.count--;
  // }

  compare(pokemonCountPair: PokemonCountPair): number {
    let result = this.pokemon.compare(pokemonCountPair.pokemon);
    if (result === 0)
        result = this.level - pokemonCountPair.level;
    if (result === 0)
      result = this.count - pokemonCountPair.count;

    return result;
  }

  equals(pokemonCountPair: PokemonCountPair): boolean {
    return this.compare(pokemonCountPair) === 0;
  }

  toString(): string {
    return `${new PokemonLevelPair(this.pokemon, this.level).toString()}: x${this.count}`;
  }
}
