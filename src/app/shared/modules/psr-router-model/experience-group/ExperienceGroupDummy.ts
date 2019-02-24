import { ExperienceGroup } from "./ExperienceGroup";

export class ExperienceGroupDummy extends ExperienceGroup {
  constructor(name: string) {
    super(name);
  }
  _getExpForLevel(level: number): number {
    return level * 0; // Kappa
  }
}
