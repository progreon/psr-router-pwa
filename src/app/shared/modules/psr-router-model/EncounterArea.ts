import { Range } from '../psr-router-util';
import { Pokemon } from './pokemon/Pokemon';

/**
 * Class representing a location.
 * @todo Everything
 */
export class EncounterArea {
  /**
   *
   * @param location
   * @param type
   * @param method
   * @param rate
   * @param slots
   */
  constructor(
    public readonly location: string,
    public readonly rate: number,
    public readonly slots: EncounterArea.Slot[] = [],
    public readonly type: string = "",
    public readonly method: string = ""
  ) { }

  toString(): string {
    let str = this.location;
    if (this.type) {
      str = `${str} (${this.type})`;
    }
    if (this.method) {
      str = `${str} [${this.method}]`;
    }
    return str;
  }
}

export namespace EncounterArea {
  export class Slot {
    constructor(
      public readonly pokemon: Pokemon,
      public readonly level: Range
    ) { }

    toString(): string {
      return `${this.pokemon.toString()} (L${this.level.toString()})`;
    }
  }
}
