const MAX_SLOTS = 20;
const MAX_PC_SLOTS = 50; // TODO
const MAX_ITEMS = 99;

/** @private */
class ItemSlot {
  constructor(item, count=1) {
    this.item = item;
    this.count = count;
  }

  isItem(item) {
    return this.item.equals(item);
  }

  equals(itemSlot) {
    return itemSlot && isItem(itemSlot.item) && this.count === itemSlot.count;
  }

  clone() {
    return new ItemSlot(this.item, this.count);
  }

  toString() {
    return this.item.toString() + " x" + this.count;
  }
}

/**
 * Class representing a player.
 * @todo Exceptions
 * @todo Pokemon to pc
 * @todo Badges
 */
class Player {
  /**
   *
   * @param {string}      name
   * @param {string}      info
   * @param {Battler[]}   team
   * @param {Location}    currentLocation
   */
  constructor(game, name, team, currentLocation) {
    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.info = info;
    /** @type {Battler[]} */
    this.team = team;
    /** @type {Location} */
    this.currentLocation = currentLocation;
    /** @type {number} */
    this._money = 0;
    /** @type {ItemSlot[]} */
    this._bagItems = [];
    /** @type {ItemSlot[]} */
    this._pcItems = [];
    /** @type {string[]} */
    this._badges = [];
  }

  /**
   * Add a battler to the team.
   * @param {Battler}   battler
   */
  addBattler(battler) {
    this.team.push(battler);
  }

  /**
   * Swap two battlers.
   * @param {number}  index1
   * @param {number}  [index2=0]
   */
  swapBattlers(index1, index2=0) {
    if (index1 >= 0 && index1 < this.team.length && index2 >= 0 && index2 < this.team.length) {
      var b = this.team[index1];
      this.team[index1] = this.team[index2];
      this.team[index2] = b;
    }
  }

  /**
   * Get the leading battler of the team.
   * @returns {Battler}
   */
  getFrontBattler() {
    return this.team.length > 0 ? this.team[0] : undefined;
  }

  //
  // public void swapToFront(Battler battler) {
  //     swapToFront(team.indexOf(battler));
  // }

  /**
   * @param {Item}      item
   * @param {boolean}   [pc=false]
   * @returns {number}
   * @private
   * @todo Return the non-full slot if multiple slots.
   */
  getItemIndex(item, pc) {
    var items = pc ? this._pcItems : this._bagItems;
    var index = 0;
    var found = false;

    while (!found && index < items.length)
      if (items[index].isItem(item))
        found = true;
      else
        index++;

    if (index === items.length)
      index = -1;

    return index;
  }

  /**
   * Add an item.
   * @param {Item}      item
   * @param {number}    [quantity=1]
   * @param {boolean}   [toPc=false]
   * @returns {boolean}  Returns true if success.
   * @todo Overflow to next slot if count > ..
   */
  addItem(item, quantity=1, toPc=false) {
    var items = toPc ? this._pcItems : this._bagItems;
    var index = this.getItemIndex(item, toPc);
    if (index > 0) {
      items[index].count += quantity;
      return true;
    } else if (index < 0 && items.length < MAX_SLOTS) {
      items.push(new ItemSlot(item, quantity));
      return true;
    } else {
      return false;
    }
  }

  /**
   * Buy an item with your money.
   * @param {Item}    item          The item you want to buy.
   * @param {number}  [quantity=1]  The amount you want to buy.
   * @returns {boolean} Returns true if success.
   */
  buyItem(item, quantity=1) {
    if (this._money < item.price * quantity) {
      return false;
    } else if (this.addItem(item, quantity)) {
      this._money -= (item.price * quantity);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Swap two items by their index.
   * @param {number}    index1
   * @param {number}    index2
   * @param {boolean}   [pc=false]
   * @returns {boolean}  Returns true if success.
   */
  swapItemsByIndex(index1, index2, pc) {
    var items = pc ? this._pcItems : this._bagItems;
    if (index1 < 0 || index1 >= items.length || index2 < 0 || index2 >= items.length || index1 === index2) {
      return false;
    } else {
      var i = items[index1];
      items[index1] = items[index2];
      items[index2] = i;
      return true;
    }
  }

  /**
   * Swap two items by their index.
   * @param {Item}      item1
   * @param {Item}      item2
   * @param {boolean}   [pc=false]
   * @returns {boolean}  Returns true if success.
   */
  swapItems(item1, item2, pc) {
    return this.swapItems(this.getItemIndex(item1, pc), getItemIndex(item2, pc), pc);
  }

  /**
   * Swap two items by their index.
   * @param {Item}      item
   * @param {number}    index
   * @param {boolean}   [pc=false]
   * @returns {boolean}  Returns true if success.
   */
  swapItemToSlot(item, index, pc) {
    return this.swapItems(this.getItemIndex(item, pc), index, pc);
  }

  /**
   * Toss an amount of an item.
   * @param {number}    index
   * @param {number}    [quantity=1]    If < 0, toss all of this item.
   * @param {boolean}   [fromPc=false]
   * @returns {boolean}  Returns true if success.
   * @todo Support tossing an item that's in multiple slots.
   */
  tossItemByIndex(index, quantity=1, fromPc=false) {
    var items = fromPc ? this._pcItems : this._bagItems;
    if (index < 0 || index > items.length || items[index].count < quantity || !items[index].item.tossableOutsideBattle) {
      return false;
    } else {
      if (quantity < 0)
        items[index].count = 0;
      else
        items[index].count -= quantity;

      if (items[index].count === 0)
        items.splice(index, 1);

      return true;
    }
  }

  /**
   * Toss an amount of an item.
   * @param {Item}      item
   * @param {number}    [quantity=1]
   * @param {boolean}   [fromPc=false]
   * @returns {boolean}  Returns true if success.
   */
  tossItem(item, quantity=1, fromPc=false) {
    return this.tossItemByIndex(this.getItemIndex(item, pc), quantity, fromPc);
  }

  /**
   * Use an item, on the given pokemon, in or outside a battle.
   * @param {Item} item
   * @param {number} [partyIndex=-1]
   * @param {Battle} [battle]
   * @returns {boolean} Returns true if success.
   * @todo Finish and test.
   */
  useItem(item, partyIndex=-1, battle=undefined) {
    var index = getItemIndex(item, false);
    if (index < 0) {
      return false;
    } else {
      var success = false;
      if (battle && item.usableInsideBattle) {
        // TODO
        // success = item.useInBattle(battle, partyIndex);
      } else if (item.usableOutsideBattle) {
        // TODO
        // success = item.use(this, partyIndex);
      }
      if (success) {
        tossItemByIndex(index, 1);
      }
    }
  }

  /**
   * Add some money to the wallet.
   * @param {number} coins
   */
  addMoney(coins) {
    if (coins > 0) {
      this._money += coins;
    }
  }

  /** @returns {number} */
  getMoney() {
    return this._money;
  }

  /**
   * @param {Item}    item
   * @param {number}  [quantity=1]
   * @returns {boolean} Returns true if successful.
   */
  depositItem(item, quantity=1) {
    return this.depositItemByIndex(this.getItemIndex(item, false));
  }

  /**
   * @param {number}  bagIndex
   * @param {number}  [quantity=1]
   * @returns {boolean} Returns true if successful.
   */
  depositItemByIndex(bagIndex, quantity=1) {
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
      }
    }
  }

  /**
   * @param {Item}    item
   * @param {number}  [quantity=1]
   * @returns {boolean} Returns true if successful.
   */
  withdrawItem(item, quantity=1) {
    return this.withdrawItemByIndex(this.getItemIndex(item, false));
  }

  /**
   * @param {number}  pcIndex
   * @param {number}  [quantity=1]
   * @returns {boolean} Returns true if successful.
   */
  withdrawItemByIndex(pcIndex, quantity=1) {
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
      }
    }
  }

  /** @returns {Player} */
  clone() {
    var newPlayer = new Player(this.name, this.info, [], this._currentLocation);
    this.team.forEach(b => newPlayer.team.push(b.clone()));
    newPlayer._money = this._money;
    this._bagItems.forEach(bi => newPlayer._bagItems.push(bi));
    this._badges.forEach(b => newPlayer._badges.push(b));
    this._pcItems.forEach(pi => newPlayer._pcItems.push(pi));
  }

  /** @returns {string} */
  toString() {
    return this.name;
  }
}

export { Player };
