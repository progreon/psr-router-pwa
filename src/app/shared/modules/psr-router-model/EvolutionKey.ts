/**
 * Class representing an evolution-key.
 * @todo See ExperienceGroup
 */
export class EvolutionKey {
  /**
   *
   * @param type  One of [level, stone, trade-item].
   * @param value The level, stone type, name of the item (or empty if just trade).
   */
  constructor(
    public readonly type: EvolutionKey.Type,
    public readonly value: string
    ) {}

  toString(): string {
    return `${EvolutionKey.Type[this.type]} (${this.value})`;
  }
}

export namespace EvolutionKey {
  export enum Type {
    Level,
    Stone,
    TradeItem
  }
}
