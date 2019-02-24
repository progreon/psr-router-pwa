import { Engine } from './Engine';

export class Engine1 implements Engine {

  public static getStageMultiplier(stage: number): number {
    if (stage < -6) stage = -6;
    if (stage > 6) stage = 6;
    return [25, 28, 33, 40, 50, 66, 1, 15, 2, 25, 3, 35, 4][stage + 6];
  }

  public static getStageDivider(stage: number): number {
    if (stage < -6) stage = -6;
    if (stage > 6) stage = 6;
    return [100, 100, 100, 100, 100, 100, 1, 10, 1, 10, 1, 10, 1][stage + 6];
  }

}