import { ExperienceGroup } from "./ExperienceGroup";

/**
 * Class representing the SLOW experience group
 */
class SlowExperienceGroup1 extends ExperienceGroup {
  constructor() {
    super("Slow");
  }

  _getExpForLevel(l: number): number {
    return Math.floor(5 * l * l * l / 4);
  }
}

/**
 * Class representing the MEDIUM_SLOW experience group
 */
class MediumSlowExperienceGroup1 extends ExperienceGroup {
  constructor() {
    super("Medium Slow");
  }

  /** @inheritdoc */
  _getExpForLevel(l: number): number {
    return Math.floor(6 * l * l * l / 5) - 15 * l * l + 100 * l - 140;
  }
}

/**
 * Class representing the MEDIUM_FAST experience group
 */
class MediumFastExperienceGroup1 extends ExperienceGroup {
  constructor() {
    super("Medium Fast");
  }

  /** @inheritdoc */
  _getExpForLevel(l: number): number {
    return l * l * l;
  }
}

/**
 * Class representing the FAST experience group
 */
class FastExperienceGroup1 extends ExperienceGroup {
  constructor() {
    super("Fast");
  }

  /** @inheritdoc */
  _getExpForLevel(l: number): number {
    return Math.floor(4 * l * l * l / 5);
  }
}

export const ExperienceGroups1: {
  "Slow": ExperienceGroup; "Medium Slow": ExperienceGroup; "Medium Fast": ExperienceGroup; "Fast": ExperienceGroup;
} = {
  "Slow": new SlowExperienceGroup1(),
  "Medium Slow": new MediumSlowExperienceGroup1(),
  "Medium Fast": new MediumFastExperienceGroup1(),
  "Fast": new FastExperienceGroup1()
};
