import { Game } from './Game';

/**
 * Class representing a location.
 * @todo Everything
 */
export class Location {
  /**
   *
   * @param game
   * @param name
   * @param subLocations
   */
  constructor(
    private game: Game,
    public readonly name: string,
    public readonly subLocations: Location[]
  ) { }

  toString(): string {
    return this.name;
  }
}
