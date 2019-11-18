import { Game, Type } from "../Model";
/**
 * Class representing a Pokemon move.
 */
export abstract class Move {
  /**
   *
   * @param key      The key to use in maps
   * @param name     A more user friendly name
   * @param effect   The name of the effect this move has
   * @param power    The power of the move
   * @param type     The type of this move
   * @param accuracy The accuracy of this move
   * @param pp       The initial PP of this move
   * @param description A description
   */
  constructor(
    public readonly key: string, //
    public readonly name: string, //
    public readonly effect: string, //
    public readonly power: number, //
    public readonly type: Type, //
    public readonly accuracy: number, //
    public readonly pp: number, //
    public readonly description: string, //
    public readonly category?: string,
  ) {
    this.category = (category ? category : "other");
  }

  toString(): string {
    return this.name;
  }
}

// /**
//  *
//  * @author Marco Willems
//  */
// public class Move {

//   public final List<Pokemon> pokemon; // Pokemon that learn this move

//   public class DamageRange {

//       private final Range values;
//       private final Range critValues;

//       public DamageRange() {
//           values = new Range();
//           critValues = new Range();
//       }

//       public DamageRange(Range values, Range critValues) {
//           this.values = values;
//           this.critValues = critValues;
//       }

//       public void addValue(int value) {
//           values.addValue(value);
//       }

//       public void addCritValue(int critValue) {
//           critValues.addValue(critValue);
//       }

//       public int getMin() {
//           return values.getMin();
//       }

//       public int getMax() {
//           return values.getMax();
//       }

//       public int getCritMin() {
//           return critValues.getMin();
//       }

//       public int getCritMax() {
//           return critValues.getMax();
//       }

//       public int getCount() {
//           return values.getCount() + critValues.getCount();
//       }

//       public double getRange(Range hp, double critChance) {
//           double tot = hp.getCount();
//           double c = 0.0;
//           for (int v : hp.getValues()) {
//               c += getRange(v, critChance);
//           }
//           return c / tot;
//       }

//       private double getRange(int hp, double critChance) {
//           if (hp <= getMin() && hp <= getCritMin()) {
//               return 1.0;
//           } else if (hp > getMax() && hp > getCritMax()) {
//               return 0.0;
//           } else {
//               double c = 0;
//               for (int v : values.getValues()) {
//                   if (hp <= v) {
//                       c++;
//                   }
//               }
//               double cc = 0;
//               for (int v : critValues.getValues()) {
//                   if (hp <= v) {
//                       cc++;
//                   }
//               }
//               return c * (1.0 - critChance) / values.getCount() + cc * critChance / critValues.getCount();
//           }
//       }

//       @Override
//       public String toString() {
//           return getMin() + "-" + getMax() + " (" + getCritMin() + "-" + getCritMax() + ")";
//       }

//       public String toString(Range hp, double critChance) {
//           double rangePercent = getRange(hp, critChance);
//           rangePercent = Math.round(rangePercent * 1000) / 10.0;
//           return toString() + (rangePercent > 0 ? " (" + rangePercent + "%)" : "");
//       }
//   }
// }

