import { Pokemon } from "./pokemon/Pokemon";

/**
 * Class representing a pokemon-level pair
 * TODO: comparable? (hash?)
 */
export class PokemonLevelPair {
  constructor( //
    public readonly pokemon: Pokemon, //
    public readonly level: number //
  ) { }

  equals(pokemonLevelPair: PokemonLevelPair): boolean {
    return pokemonLevelPair && this.toString() === pokemonLevelPair.toString();
  }

  compare(pokemonLevelPair: PokemonLevelPair): number {
    let result = this.pokemon.compare(pokemonLevelPair.pokemon);
    if (result === 0)
        result = this.level - pokemonLevelPair.level;

    return result;
  }

  toString(): string {
    return `${this.pokemon.toString()} (L${this.level})`;
  }
}
