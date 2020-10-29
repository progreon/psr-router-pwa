import { EncounterArea } from './EncounterArea';

/**
 * Class representing a location.
 * @todo Everything
 */
export class Location {
  public readonly encounterAreas: EncounterArea[] = [];
  /**
   *
   * @param name
   * @param subLocations
   */
  constructor(
    public readonly name: string,
    public readonly subLocations: Location[] = []
  ) { }

  public addEncounterArea(ea: EncounterArea) {
    this.encounterAreas.push(ea);
  }

  toString(): string {
    return this.name;
  }
}
