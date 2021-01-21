import { Item } from "./Item";
import { Battler } from "./battler/Battler";
import { EvolutionKey } from "./EvolutionKey";
import { RouteBattle } from "../psr-router-route/RouteBattle";

// TODO: checks when adding key items?

const MAX_SLOTS = 20;
const MAX_PC_SLOTS = 50; // TODO
const MAX_ITEMS = 99;

class ItemSlot {
  constructor( //
    public readonly item: Item, //
    public count = 1 //
  ) { }

  isItem(item: Item): boolean {
    return this.item.equals(item);
  }

  equals(itemSlot: ItemSlot): boolean {
    return itemSlot && this.isItem(itemSlot.item) && this.count === itemSlot.count;
  }

  clone(): ItemSlot {
    return new ItemSlot(this.item, this.count);
  }

  toString(): string {
    let str = `${this.item.toString()}`;
    if (!(this.item.isKeyItem || this.item.isHm()) || this.count != 1) {
      str = `${str} x${this.count}`;
    }
    return str;
  }
}

/**
 * Class representing a player.
 * @todo Exceptions
 * @todo Pokemon to pc
 * @todo Badges
 */
export class Player {
  private _money: number;
  private _bagItems: ItemSlot[];
  private _pcItems: ItemSlot[];
  private _badges: string[];
  get money(): number { return this._money; }
  get bag(): ItemSlot[] { return this._bagItems.slice(); }
  get badges(): string[] { return this._badges.slice(); }
  /**
   *
   * @param name
   * @param info
   * @param team
   * @param currentLocation
   */
  constructor( //
    public readonly name: string = "Red", //
    public readonly info: string = "", //
    public readonly team: Battler[] = [], //
    money: number = 3000,
    public currentLocation: string = "" // TODO: to Location?
  ) {
    this._money = money;
    this._bagItems = [];
    this._pcItems = [];
    this._badges = [];
  }

  public addBadge(badge: string) {
    if (!this.hasBadge(badge)) {
      this._badges.push(badge.toUpperCase());
    }
  }

  public hasBadge(badge: string): boolean {
    return this._badges.indexOf(badge.toUpperCase()) >= 0;
  }

  /**
   * Add a battler to the team.
   * @param battler
   */
  addBattler(battler: Battler) {
    this.team.push(battler);
  }

  /**
   * Swap two battlers.
   * @param index1
   * @param index2
   */
  swapBattlers(index1: number, index2 = 0) {
    if (index1 >= 0 && index1 < this.team.length && index2 >= 0 && index2 < this.team.length) {
      let b = this.team[index1];
      this.team[index1] = this.team[index2];
      this.team[index2] = b;
    }
  }

  /**
   * Get the leading battler of the team.
   * @returns The leading battler
   */
  getFrontBattler(): Battler {
    return this.team.length > 0 ? this.team[0] : null;
  }

  //
  // public void swapToFront(Battler battler) {
  //     swapToFront(team.indexOf(battler));
  // }

  /**
   * @param item
   * @param pc
   * @todo Return the non-full slot if multiple slots.
   */
  public getItemIndex(item: Item, pc = false): number {
    let items = pc ? this._pcItems : this._bagItems;
    let index = 0;
    let found = false;

    while (!found && index < items.length)
      if (items[index].isItem(item))
        found = true;
      else
        index++;

    if (index === items.length)
      index = -1;

    return index;
  }

  public getItemByIndex(itemIndex: number, pc: boolean = false): Item {
    let items = pc ? this._pcItems : this._bagItems;
    if (itemIndex >= 0 && itemIndex < items.length) {
      return items[itemIndex].item;
    } else {
      return null;
    }
  }

  /**
   * Add an item.
   * @param item
   * @param quantity
   * @param toPc
   * @returns Returns true if success.
   * @todo Overflow to next slot if count > ..
   */
  addItem(item: Item, quantity: number = 1, toPc: boolean = false, force: boolean = false): boolean {
    let items = toPc ? this._pcItems : this._bagItems;
    let index = this.getItemIndex(item, toPc);
    if (index >= 0) {
      items[index].count += quantity;
      return true;
    } else if (index < 0 && items.length < MAX_SLOTS) {
      items.push(new ItemSlot(item, quantity));
      return true;
    } else {
      if (force) {
        items.push(new ItemSlot(item, quantity));
      }
      return false;
    }
  }

  /**
   * Buy an item with your money.
   * @param item      The item you want to buy.
   * @param quantity  The amount you want to buy.
   * @returns Returns true if success.
   */
  buyItem(item: Item, quantity: number = 1, force: boolean = false): boolean {
    if (force) {
      this._money -= (item.price * quantity);
      return this.addItem(item, quantity, false, force);
    } else if (this._money < item.price * quantity) {
      return false;
    } else if (this.addItem(item, quantity, false)) {
      this._money -= (item.price * quantity);
      return true;
    } else {
      return false;
    }
  }

  sellItem(item: Item, quantity: number = 1, force: boolean = false): boolean {
    if (item.price == 0) {
      return false;
    } else {
      this._money += (item.price * quantity / 2);
      return this.tossItem(item, quantity, false, force); // re-using this code to remove the items
    }
  }

  /**
   * Swap two items by their index.
   * @param index1
   * @param index2
   * @param pc
   * @returns Returns true if success.
   */
  swapItemsByIndex(index1: number, index2: number, pc: boolean = false): boolean {
    let items = pc ? this._pcItems : this._bagItems;
    if (index1 < 0 || index1 >= items.length || index2 < 0 || index2 >= items.length || index1 === index2) {
      return false;
    } else {
      let i = items[index1];
      items[index1] = items[index2];
      items[index2] = i;
      return true;
    }
  }

  /**
   * Swap two items by their index.
   * @param item1
   * @param item2
   * @param pc
   * @returns Returns true if success.
   */
  swapItems(item1: Item, item2: Item, pc: boolean = false): boolean {
    return this.swapItemsByIndex(this.getItemIndex(item1, pc), this.getItemIndex(item2, pc), pc);
  }

  /**
   * Swap two items by their index.
   * @param item
   * @param index
   * @param pc
   * @returns Returns true if success.
   */
  swapItemToSlot(item: Item, index: number, pc: boolean = false): boolean {
    return this.swapItemsByIndex(this.getItemIndex(item, pc), index, pc);
  }

  /**
   * Toss an amount of an item.
   * @param index
   * @param quantity  If < 0, toss all of this item.
   * @param fromPc
   * @returns Returns true if success.
   * @todo Support tossing an item that's in multiple slots.
   */
  tossItemByIndex(index: number, quantity: number = 1, fromPc: boolean = false, force: boolean = false): boolean {
    let items = fromPc ? this._pcItems : this._bagItems;
    if (index < 0 || index > items.length || (!force && items[index].count < quantity) || !items[index].item.tossableOutsideBattle) {
      return false;
    } else {
      if (quantity < 0)
        items[index].count = 0;
      else
        items[index].count -= quantity;

      if (items[index].count <= 0)
        items.splice(index, 1);

      return true;
    }
  }

  /**
   * Toss an amount of an item.
   * @param item
   * @param quantity
   * @param fromPc
   * @returns Returns true if success.
   */
  tossItem(item: Item, quantity: number = 1, fromPc: boolean = false, force: boolean = false): boolean {
    return quantity == 0 || this.tossItemByIndex(this.getItemIndex(item, fromPc), quantity, fromPc, force);
  }

  /**
   * Use an item, on the given pokemon, in or outside a battle.
   * @param item
   * @param partyIndex
   * @param battle
   * @returns Returns true if success.
   * @todo Finish and test.
   */
  useItem(item: Item, partyIndex: number = -1, moveIndex: number = -1, battleStage?: RouteBattle.Stage, force: boolean = false): boolean {
    let index = this.getItemIndex(item, false); // TODO: temporarily disabled because no GetI implementation yet!
    
    if (!force) {
      if (index < 0) return false;
      if (battleStage && !item.usableInsideBattle) return false;
      if (!battleStage && !item.usableOutsideBattle) return false;
    }

    // Item management isn't mandatory, so always try to use it even if the player doesn't have the item
    let doToss = (battleStage || item.tossableOutsideBattle) && !item.isKeyItem; // TODO: test this properly
    switch (item.type) {
      case "STONE":
        // TODO: arg check
        let newBattler = this.team[partyIndex].evolve(new EvolutionKey(EvolutionKey.Type.Stone, item.key));
        if (newBattler == this.team[partyIndex]) return false;
        this.team[partyIndex] = newBattler;
        break;
      case "STAT":
        switch (item.value) {
          case "LV":
            this.team[partyIndex] = this.team[partyIndex].useCandy();
            break;
          case "HP":
            return this.team[partyIndex].useHPUp(1);
          case "ATK":
            return this.team[partyIndex].useProtein(1);
          case "DEF":
            return this.team[partyIndex].useIron(1);
          case "SPD":
            return this.team[partyIndex].useCarbos(1);
          case "SPC":
            return this.team[partyIndex].useCalcium(1);
          case "PP":
            // TODO
            // return this.team[partyIndex].usePPUp(1);
          default:
            return false;
        }
        break;
      case "TM":
        // TODO: arg check
        let oldMove = this.team[partyIndex]?.moveset[moveIndex]?.move;
        if (!this.team[partyIndex].learnTmMove(item, oldMove)) return false;
        break;
      case "BATTLE":
        if (battleStage) {
          battleStage.useBattleItem(item.value);
        }
        break;
    }
    // TODO: others?
    let result = true;
    if (doToss) {
      result = this.tossItemByIndex(index, 1, false, force);
    }
    if (force) {
      if (battleStage && !item.usableInsideBattle) return false;
      if (!battleStage && !item.usableOutsideBattle) return false;
    }
    return result;
  }

  /**
   * Add some money to the wallet.
   * @param coins
   */
  addMoney(coins: number) {
    if (coins > 0) {
      this._money += coins;
    }
  }

  /**
   * @param item
   * @param quantity
   * @returns Returns true if successful.
   */
  depositItem(item: Item, quantity: number = 1, force: boolean = false): boolean {
    return this.depositItemByIndex(this.getItemIndex(item, false), quantity, force);
  }

  /**
   * @param bagIndex
   * @param quantity
   * @returns Returns true if successful.
   */
  depositItemByIndex(bagIndex: number, quantity: number = 1, force: boolean = false): boolean {
    // TODO: handle force
    if (bagIndex < 0 || bagIndex >= this._bagItems.length || this._pcItems.length == MAX_PC_SLOTS) {
      return false;
    } else {
      if (this.addItem(this._bagItems[bagIndex].item, quantity, true)) {
        if (this.tossItemByIndex(bagIndex, quantity)) {
          return true;
        } else { // rollback
          this.tossItem(this._bagItems[bagIndex].item, quantity, true);
          return false;
        }
      } else {
        return false;
      }
    }
  }

  /**
   * @param item
   * @param quantity
   * @returns Returns true if successful.
   */
  withdrawItem(item: Item, quantity: number = 1, force: boolean = false): boolean {
    return this.withdrawItemByIndex(this.getItemIndex(item, false), quantity, force);
  }

  /**
   * @param pcIndex
   * @param quantity
   * @returns Returns true if successful.
   */
  withdrawItemByIndex(pcIndex: number, quantity: number = 1, force: boolean = false): boolean {
    // TODO: handle force
    if (pcIndex < 0 || pcIndex >= this._pcItems.length || this._bagItems.length == MAX_SLOTS) {
      return false;
    } else {
      if (this.addItem(this._pcItems[pcIndex].item, quantity)) {
        if (this.tossItemByIndex(pcIndex, quantity, true)) {
          return true;
        } else { // rollback
          this.tossItem(this._pcItems[pcIndex].item, quantity);
          return false;
        }
      } else {
        return false;
      }
    }
  }

  /**
   * @param item
   * @param pc
   */
  getItemCount(item: Item, pc = false): number {
    let items = pc ? this._pcItems : this._bagItems;
    let count = 0;
    items.forEach(slot => {
      if (slot.isItem(item)) {
        count += slot.count;
      }
    });
    return count;
  }

  clone(): Player {
    let newPlayer = new Player(this.name, this.info, [], this.money, this.currentLocation);
    this.team.forEach(b => newPlayer.team.push(b.clone()));
    newPlayer._money = this._money;
    this._bagItems.forEach(bi => newPlayer._bagItems.push(bi.clone()));
    this._badges.forEach(b => newPlayer._badges.push(b));
    this._pcItems.forEach(pi => newPlayer._pcItems.push(pi.clone()));
    return newPlayer;
  }

  toString(): string {
    return this.name;
  }
}
